#!/usr/bin/env node
/**
 * QCP template pre-flight: will this `<Title>.txt` open in BO QCPAdmin as the QCP it
 * describes?
 *
 *   node scripts/check-qcp-template.mjs <Title.txt>
 *
 * WHY THIS EXISTS
 * ---------------
 * QCPAdmin keeps a QCP as one JSON document, `<Title>.txt`, in the QCP document library
 * and loads it with `JSON.parse(text).processPhases`. There is no importer in front of
 * that load: whatever is in the file is the editor state. A file that parses but breaks
 * an invariant the editor relies on does not fail loudly; it opens with a phase that
 * cannot be edited, a trigger whose icon is wrong, a dependency dropdown that shows
 * nothing, or an ID collision that overwrites a checkpoint the next time one is added.
 * This script asks the questions the editor never asks, before the file is uploaded.
 *
 * It is a reimplementation of the invariants read out of
 *
 *     bo-qcp-admin@v0.2.0:src/webparts/qcpAdmin/components/QcpAdmin.tsx
 *     bo-qcp-admin@v0.2.0:src/webparts/qcpAdmin/components/Modal/ProcessDetail.ts
 *     bo-qcp-admin@v0.2.0:src/webparts/qcpAdmin/components/Modal/ProcessPhase.ts
 *     bo-qcp-admin@v0.2.0:src/webparts/qcpAdmin/components/Modal/QCPModal.ts
 *
 * on 2026-10-19 (_addNewPhase and _addPhaseDetails for ids and sort order, _onSave for
 * relevantDocs_forms_links, _onDependancySave for the mirrored dependency list,
 * componentDidMount for the Action/ActionIcon pairs and the Source keys, _onTriggerSave
 * and _onTriggerFormSave for the per-field rules, _addToTimelineSave for the timeline
 * entry). The three Modal interfaces are vendored under assets/qcp/upstream/ and pinned
 * by blob in scripts/check-schema-sync.sh; when that reports drift, re-read QcpAdmin.tsx
 * before trusting these results. Two statements of one behaviour can drift; this is a
 * CHECK and never the contract. When they disagree, the editor is right and this file is
 * the bug.
 *
 * Structural validation (a missing key, a wrong type, an unknown enum value) is the job
 * of ajv against assets/qcp/qcp-template.schema.json (see test/qcp/README.md). This
 * script repeats only the structure it needs to walk the file safely, then checks what
 * the schema cannot express:
 *
 *   errors (exit 1; the editor will misbehave)
 *     - the file is the v1 exchange format (schema_version / qcp / phases): the Import
 *       dialog accepts that shape, but the editor cannot open what it stores
 *     - qcpTitle differs from the file name (the editor reads <qcpTitle>.txt)
 *     - processPhasesLength is not processPhases.length
 *     - a duplicate phase ID, or a duplicate detail ID anywhere in the file
 *     - LPID or LPDID below the highest ID in use (the next phase or detail the editor
 *       adds would reuse an ID)
 *     - phase sortOrder not 1..n, detail sortOrderDetails not 0..m-1
 *     - a trigger whose ActionIcon does not match its Action, a Choice trigger without a
 *       Status, a DateTime trigger with one or with a non-numeric Extender
 *     - more than one triggerForm, or a triggerForm whose FormUrl is not under SiteUrl
 *     - relevantDocs_forms_links that is not the derivation the editor would write
 *       (formlinks for triggerForm first, then relevantlinks for relevantDocuments)
 *     - a dependency on a phase or detail that is not in the file, on the detail itself,
 *       whose titles do not match the ids, or that is not mirrored exactly in
 *       statusInformations.dependencies
 *     - a notification without an address, or an address without the flag
 *     - runtime state in a template: non-empty status, comments, modifiedBy, timestamps
 *
 *   warnings (exit 0; worth a look)
 *     - a description with no HTML tags (the editor is a rich-text box; plain text
 *       renders as one paragraph)
 *     - a non-zero percentage, a non-empty processDetailsSelected
 *     - addToTimeline written as the legacy boolean false
 *     - a `#` or `%` in the title (legal in modern SharePoint, historically not)
 *     - two triggers on one checkpoint setting the same list/field for the same Action
 *     - a phase or a checkpoint with no checkpoints / an empty title
 *     - a GDL link or work file whose Link is not server-relative (/sites/...)
 */

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const ACTIONS = { Started: 'Play', Completed: 'CheckMark', Deviation: 'ReportHacked' };
const FIELD_TYPES = ['Choice', 'DateTime'];
const SOURCES = ['ExternalLink', 'GDL'];
const DETAIL_KEYS = [
  'ID', 'title', 'description', 'status', 'comments', 'checklistDocuments', 'relevantDocuments',
  'modifiedBy', 'percentage', 'sortOrderDetails', 'triggers', 'triggerForm', 'dependantFields',
  'addToTimeline', 'statusInformations', 'na', 'commentMandatory', 'relevantDocs_forms_links'
];
const PHASE_KEYS = ['ID', 'title', 'type', 'processDetails', 'percentage', 'phasePercentageCompleted', 'sortOrder'];
const TOP_KEYS = [
  'qcpTitle', 'processPhases', 'processPhasesLength', 'percentage', 'processDetailsSelected',
  'processPhaseSelectedIndex', 'qcpDetailsPopupShow', 'multiline', 'qcpValidation', 'LPID', 'LPDID'
];
const STATUS_KEYS = ['started', 'startedBy', 'completed', 'completedBy', 'deviation', 'deviationBy', 'naUpdated', 'naUpdatedBy'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function load(path) {
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch (e) {
    return { error: `cannot read ${path}: ${e.message}` };
  }
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  try {
    return { file: JSON.parse(text) };
  } catch (e) {
    return { error: `not JSON: ${e.message}` };
  }
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isInt = (v) => Number.isInteger(v);

function structuralErrors(file) {
  const errors = [];
  if (!isObj(file)) return [{ path: '', message: 'top level is not an object' }];
  if ('schema_version' in file && 'qcp' in file) {
    return [{ path: '', message: 'this is the v1 exchange file (schema_version/qcp/phases). The Import dialog validates that shape, but the editor only opens the stored body (qcpTitle/processPhases). /bo:qcp writes <Title>.txt in the stored shape; re-run the final step' }];
  }
  if ('kind' in file && file.kind === 'bo-atlas-diagram') {
    return [{ path: '', message: 'this is a .diagram.json for BO Atlas, not a QCP; /bo:process is the command for that format' }];
  }
  for (const k of TOP_KEYS) if (!(k in file)) errors.push({ path: `/${k}`, message: 'missing' });
  if (errors.length) return errors;
  if (typeof file.qcpTitle !== 'string' || !file.qcpTitle) errors.push({ path: '/qcpTitle', message: 'must be a non-empty string' });
  if (!Array.isArray(file.processPhases)) return errors.concat([{ path: '/processPhases', message: 'must be an array' }]);
  file.processPhases.forEach((p, pi) => {
    const pp = `/processPhases/${pi}`;
    if (!isObj(p)) { errors.push({ path: pp, message: 'not an object' }); return; }
    for (const k of PHASE_KEYS) if (!(k in p)) errors.push({ path: `${pp}/${k}`, message: 'missing' });
    if (!isInt(p.ID)) errors.push({ path: `${pp}/ID`, message: 'must be an integer' });
    if (!isInt(p.sortOrder)) errors.push({ path: `${pp}/sortOrder`, message: 'must be an integer' });
    if (p.type !== 'newtype') errors.push({ path: `${pp}/type`, message: 'must be "newtype" (the only value the editor writes)' });
    if (!Array.isArray(p.processDetails)) { errors.push({ path: `${pp}/processDetails`, message: 'must be an array' }); return; }
    p.processDetails.forEach((d, di) => {
      const dp = `${pp}/processDetails/${di}`;
      if (!isObj(d)) { errors.push({ path: dp, message: 'not an object' }); return; }
      for (const k of DETAIL_KEYS) if (!(k in d)) errors.push({ path: `${dp}/${k}`, message: 'missing' });
      if (!isInt(d.ID)) errors.push({ path: `${dp}/ID`, message: 'must be an integer' });
      if (!isInt(d.sortOrderDetails)) errors.push({ path: `${dp}/sortOrderDetails`, message: 'must be an integer' });
      for (const k of ['triggers', 'triggerForm', 'dependantFields', 'relevantDocuments', 'checklistDocuments', 'relevantDocs_forms_links']) {
        if (k in d && !Array.isArray(d[k])) errors.push({ path: `${dp}/${k}`, message: 'must be an array' });
      }
      if (!isObj(d.statusInformations)) errors.push({ path: `${dp}/statusInformations`, message: 'must be an object' });
      else if (!Array.isArray(d.statusInformations.dependencies)) errors.push({ path: `${dp}/statusInformations/dependencies`, message: 'must be an array' });
      if (!(Array.isArray(d.addToTimeline) || d.addToTimeline === false)) errors.push({ path: `${dp}/addToTimeline`, message: 'must be an array (the legacy boolean false is tolerated)' });
    });
  });
  return errors;
}

function sameDep(a, b) {
  return a.PhaseID == b.PhaseID && a.PhaseDetailID == b.PhaseDetailID && a.PhaseTitle === b.PhaseTitle && a.PhaseDetailTitle === b.PhaseDetailTitle && a.Status === b.Status;
}

function derivedLinks(d) {
  const out = [];
  for (const f of d.triggerForm) {
    out.push({ Label: f.Listname, Link: String(f.SiteUrl).split('/sites')[0] + f.FormUrl, Type: 'formlink', SiteUrl: f.SiteUrl, Listname: f.Listname, FormUrl: f.FormUrl });
  }
  for (const doc of d.relevantDocuments) {
    out.push({ Label: doc.Label, Link: doc.Link, Type: 'relevantlink', SiteUrl: '', Listname: '', FormUrl: '' });
  }
  return out;
}

function sameLink(a, b) {
  return ['Label', 'Link', 'Type', 'SiteUrl', 'Listname', 'FormUrl'].every((k) => a[k] === b[k]);
}

function invariantErrors(file, fileName) {
  const errors = [];
  const warnings = [];
  const err = (path, message) => errors.push({ path, message });
  const warn = (path, message) => warnings.push({ path, message });

  // --- file name and title
  const expected = `${file.qcpTitle}.txt`;
  if (fileName && fileName !== expected) {
    err('/qcpTitle', `file is named "${fileName}" but the editor reads "${expected}": the name in the library and qcpTitle must match`);
  }
  if (/["*:<>?/\\|]/.test(file.qcpTitle)) err('/qcpTitle', 'contains a character SharePoint refuses in a file name (" * : < > ? / \\ |)');
  else if (/[#%]/.test(file.qcpTitle)) warn('/qcpTitle', 'contains # or %: allowed in modern SharePoint, refused by older tenant settings');
  if (/^[\s.]|[\s.]$/.test(file.qcpTitle)) err('/qcpTitle', 'leading or trailing space/dot is stripped from the file name, so the editor would look for a different file');

  // --- top-level bookkeeping
  if (file.processPhasesLength !== file.processPhases.length) {
    err('/processPhasesLength', `is ${file.processPhasesLength}, processPhases has ${file.processPhases.length}`);
  }
  if (file.percentage !== 0) warn('/percentage', 'runtime progress in a template; the editor shows it until the first save');
  if (Array.isArray(file.processDetailsSelected) && file.processDetailsSelected.length) {
    warn('/processDetailsSelected', 'not empty; the editor replaces it with processPhases[0] on load, so it is dead weight');
  }
  if (file.processPhases.length === 0) err('/processPhases', 'no phases');

  // --- ids
  const phaseIds = new Map();
  const detailIds = new Map();
  let maxPhase = 0;
  let maxDetail = 0;
  file.processPhases.forEach((p, pi) => {
    const pp = `/processPhases/${pi}`;
    if (phaseIds.has(p.ID)) err(`${pp}/ID`, `duplicate phase ID ${p.ID} (also ${phaseIds.get(p.ID)})`);
    phaseIds.set(p.ID, pp);
    maxPhase = Math.max(maxPhase, p.ID);
    if (!p.title) warn(`${pp}/title`, 'empty phase title');
    if (p.processDetails.length === 0) warn(`${pp}/processDetails`, 'phase has no checkpoints');
    if (p.percentage !== 0 || p.phasePercentageCompleted !== false) warn(`${pp}/percentage`, 'runtime progress in a template');
    p.processDetails.forEach((d, di) => {
      const dp = `${pp}/processDetails/${di}`;
      if (detailIds.has(d.ID)) err(`${dp}/ID`, `duplicate detail ID ${d.ID} (also ${detailIds.get(d.ID)}); detail ids are unique across the whole QCP`);
      detailIds.set(d.ID, dp);
      maxDetail = Math.max(maxDetail, d.ID);
    });
  });
  if (file.LPID < maxPhase) err('/LPID', `is ${file.LPID} but the highest phase ID is ${maxPhase}; the next phase the editor adds would get ID ${file.LPID + 1}`);
  else if (file.LPID > maxPhase) warn('/LPID', `is ${file.LPID}, highest phase ID in use is ${maxPhase} (harmless gap)`);
  if (file.LPDID < maxDetail) err('/LPDID', `is ${file.LPDID} but the highest detail ID is ${maxDetail}; the next checkpoint the editor adds would get ID ${file.LPDID + 1}`);
  else if (file.LPDID > maxDetail) warn('/LPDID', `is ${file.LPDID}, highest detail ID in use is ${maxDetail} (harmless gap)`);

  // --- sort order
  const phaseOrders = file.processPhases.map((p) => p.sortOrder).sort((a, b) => a - b);
  if (phaseOrders.some((o, i) => o !== i + 1)) {
    err('/processPhases', `phase sortOrder must be 1..${phaseOrders.length} with no gaps; got [${phaseOrders.join(', ')}]`);
  }

  // --- per checkpoint
  file.processPhases.forEach((p, pi) => {
    const pp = `/processPhases/${pi}`;
    const orders = p.processDetails.map((d) => d.sortOrderDetails).sort((a, b) => a - b);
    if (orders.some((o, i) => o !== i)) {
      err(`${pp}/processDetails`, `sortOrderDetails must be 0..${orders.length - 1} with no gaps (0-based, unlike phases); got [${orders.join(', ')}]`);
    }
    p.processDetails.forEach((d, di) => {
      const dp = `${pp}/processDetails/${di}`;
      if (!d.title) warn(`${dp}/title`, 'empty checkpoint title');
      if (typeof d.description === 'string' && d.description.trim() && !/<[a-z][\s\S]*>/i.test(d.description)) {
        warn(`${dp}/description`, 'no HTML tags; the editor is a rich-text box and plain text renders as one paragraph. Wrap in <p>, use <ul><li> for lists');
      }
      for (const k of ['status', 'comments', 'modifiedBy']) {
        if (d[k] !== '') err(`${dp}/${k}`, `runtime state in a template (must be "")`);
      }
      if (d.percentage !== 0) warn(`${dp}/percentage`, 'runtime progress in a template');
      for (const k of STATUS_KEYS) {
        if (d.statusInformations[k] !== '') err(`${dp}/statusInformations/${k}`, 'runtime timestamp in a template (must be "")');
      }

      // triggers
      const seen = new Set();
      d.triggers.forEach((t, ti) => {
        const tp = `${dp}/triggers/${ti}`;
        if (!(t.Action in ACTIONS)) err(`${tp}/Action`, `"${t.Action}" is not Started, Completed or Deviation (English, whatever the UI language)`);
        else if (t.ActionIcon !== ACTIONS[t.Action]) err(`${tp}/ActionIcon`, `"${t.ActionIcon}" does not match Action ${t.Action}; the editor writes ${ACTIONS[t.Action]}`);
        if (!FIELD_TYPES.includes(t.FieldType)) err(`${tp}/FieldType`, `"${t.FieldType}" is not Choice or DateTime`);
        if (!t.ListName) err(`${tp}/ListName`, 'empty');
        if (!t.Field) err(`${tp}/Field`, 'empty');
        if (t.FieldType === 'Choice') {
          if (!t.Status) err(`${tp}/Status`, 'a Choice trigger needs the value to set, exactly as the column spells it');
          if (t.Extender !== '' && t.Extender !== undefined) err(`${tp}/Extender`, 'must be "" on a Choice trigger');
        }
        if (t.FieldType === 'DateTime') {
          if (t.Status !== '') err(`${tp}/Status`, 'must be "" on a DateTime trigger; the date is today plus Extender days');
          if (!/^-?\d*$/.test(String(t.Extender ?? ''))) err(`${tp}/Extender`, `"${t.Extender}" is not a whole number of days ("" means 0)`);
          if (typeof t.Extender !== 'string') err(`${tp}/Extender`, 'must be a string (the editor stores the text-box value)');
        }
        const key = `${t.Action}|${t.ListName}|${t.Field}`;
        if (seen.has(key)) warn(tp, `second trigger on ${t.Action} setting ${t.ListName}.${t.Field}; the last one wins`);
        seen.add(key);
      });

      // trigger form
      if (d.triggerForm.length > 1) err(`${dp}/triggerForm`, `has ${d.triggerForm.length} entries; the editor keeps exactly one and only ever edits [0]`);
      d.triggerForm.forEach((f, fi) => {
        const fp = `${dp}/triggerForm/${fi}`;
        if (!/^https:\/\/[^/]+\/sites\/[^/]+$/.test(String(f.SiteUrl))) err(`${fp}/SiteUrl`, `"${f.SiteUrl}" is not an absolute hub-site URL (https://<tenant>/sites/<hub>)`);
        if (!f.Listname) err(`${fp}/Listname`, 'empty');
        if (!/^\/sites\/.+\.aspx$/.test(String(f.FormUrl))) err(`${fp}/FormUrl`, `"${f.FormUrl}" is not a server-relative form URL (/sites/<hub>/Lists/<list>/NewForm.aspx)`);
        else {
          try {
            const sitePath = new URL(f.SiteUrl).pathname.replace(/\/$/, '');
            if (!String(f.FormUrl).startsWith(sitePath + '/')) err(`${fp}/FormUrl`, `is not under SiteUrl path ${sitePath}`);
          } catch { /* SiteUrl already reported */ }
        }
      });

      // documents
      d.relevantDocuments.forEach((doc, li) => {
        const lp = `${dp}/relevantDocuments/${li}`;
        if (!SOURCES.includes(doc.Source)) err(`${lp}/Source`, `"${doc.Source}" is not ExternalLink or GDL`);
        if (doc.Source === 'ExternalLink') {
          if (doc.Label !== 'External Link') err(`${lp}/Label`, 'the editor writes the literal "External Link" for an external link');
          if (!/^https?:\/\//.test(String(doc.Link))) err(`${lp}/Link`, 'must be an absolute http(s) URL');
        }
        if (doc.Source === 'GDL') {
          if (!doc.Label) err(`${lp}/Label`, 'empty');
          if (!doc.Link) err(`${lp}/Link`, 'empty');
          else if (!/^\/sites\//.test(String(doc.Link))) warn(`${lp}/Link`, 'a governing-document link is normally server-relative (/sites/...), which is what the picker stores');
        }
      });
      d.checklistDocuments.forEach((wf, wi) => {
        const wp = `${dp}/checklistDocuments/${wi}`;
        if (wf.Source !== 'GDL') err(`${wp}/Source`, 'a work file is always a governing document (Source "GDL")');
        if (!wf.Label) err(`${wp}/Label`, 'empty');
        if (!wf.Link) err(`${wp}/Link`, 'empty');
        else if (!/^\/sites\//.test(String(wf.Link))) warn(`${wp}/Link`, 'a work-file link is normally server-relative (/sites/...)');
        if (wf.Folder !== '') err(`${wp}/Folder`, 'must be ""');
      });

      // derived link list
      const want = derivedLinks(d);
      const have = d.relevantDocs_forms_links;
      if (have.length !== want.length || have.some((l, i) => !sameLink(l, want[i]))) {
        err(`${dp}/relevantDocs_forms_links`, `is not what the editor derives from triggerForm (as formlink, first) and relevantDocuments (as relevantlink): expected ${JSON.stringify(want)}`);
      }

      // dependencies
      d.dependantFields.forEach((dep, xi) => {
        const xp = `${dp}/dependantFields/${xi}`;
        const phase = file.processPhases.find((q) => q.ID == dep.PhaseID);
        if (!phase) { err(`${xp}/PhaseID`, `no phase with ID ${dep.PhaseID}`); return; }
        const target = phase.processDetails.find((q) => q.ID == dep.PhaseDetailID);
        if (!target) { err(`${xp}/PhaseDetailID`, `phase ${dep.PhaseID} has no checkpoint with ID ${dep.PhaseDetailID}`); return; }
        if (target === d) err(xp, 'checkpoint depends on itself');
        if (dep.PhaseTitle !== phase.title) err(`${xp}/PhaseTitle`, `"${dep.PhaseTitle}" but phase ${dep.PhaseID} is titled "${phase.title}"`);
        if (dep.PhaseDetailTitle !== target.title) err(`${xp}/PhaseDetailTitle`, `"${dep.PhaseDetailTitle}" but checkpoint ${dep.PhaseDetailID} is titled "${target.title}"`);
        if (dep.Status !== 'Not Started') err(`${xp}/Status`, 'must be "Not Started" in a template');
        if (!isInt(dep.PhaseID) || !isInt(dep.PhaseDetailID)) warn(xp, 'PhaseID/PhaseDetailID are strings; the editor compares loosely but its dropdowns key on the numeric ID');
      });
      const mirror = d.statusInformations.dependencies;
      if (mirror.length !== d.dependantFields.length || mirror.some((m, i) => !sameDep(m, d.dependantFields[i]))) {
        err(`${dp}/statusInformations/dependencies`, 'must mirror dependantFields exactly (the editor pushes every dependency to both)');
      }

      // timeline
      if (d.addToTimeline === false) {
        warn(`${dp}/addToTimeline`, 'legacy boolean false; write [] instead (the editor tolerates false on load but never writes it)');
      } else {
        if (d.addToTimeline.length > 1) err(`${dp}/addToTimeline`, `has ${d.addToTimeline.length} entries; the editor keeps one`);
        d.addToTimeline.forEach((t, ti) => {
          const tp = `${dp}/addToTimeline/${ti}`;
          if (typeof t.addToTimeline !== 'boolean' || typeof t.sendNotification !== 'boolean') err(tp, 'addToTimeline and sendNotification must be booleans');
          if (t.sendNotification && !EMAIL.test(String(t.notify))) err(`${tp}/notify`, 'sendNotification is true but notify is not an e-mail address');
          if (!t.sendNotification && t.notify) err(`${tp}/notify`, 'an address is set but sendNotification is false; the editor would not send it');
          if (!t.addToTimeline && !t.sendNotification) warn(tp, 'entry with both flags false; [] means the same');
        });
      }
    });
  });

  return { errors, warnings };
}

function print(label, items) {
  for (const it of items) console.log(`  ${label} ${it.path || '/'}: ${it.message}`);
}

function main(argv) {
  if (argv.length < 1) {
    console.error('usage: node scripts/check-qcp-template.mjs <Title.txt>');
    return 2;
  }
  const path = argv[0];
  const loaded = load(path);
  if (loaded.error) {
    console.log(`${path}\n  ERROR /: ${loaded.error}`);
    return 1;
  }
  const file = loaded.file;
  console.log(path);
  const structural = structuralErrors(file);
  if (structural.length) {
    print('ERROR', structural);
    console.log(`\n${structural.length} structural error(s); the invariant checks did not run. Validate with ajv against assets/qcp/qcp-template.schema.json for the full list.`);
    return 1;
  }
  const { errors, warnings } = invariantErrors(file, basename(path));
  print('ERROR', errors);
  print('warn ', warnings);
  const phases = file.processPhases.length;
  const details = file.processPhases.reduce((n, p) => n + p.processDetails.length, 0);
  const triggers = file.processPhases.reduce((n, p) => n + p.processDetails.reduce((m, d) => m + d.triggers.length, 0), 0);
  console.log(`\n"${file.qcpTitle}": ${phases} phase(s), ${details} checkpoint(s), ${triggers} trigger(s). ${errors.length} error(s), ${warnings.length} warning(s).`);
  if (errors.length === 0) console.log(`Upload as "${file.qcpTitle}.txt" over the empty file QCPAdmin created for a QCP named "${file.qcpTitle}".`);
  return errors.length ? 1 : 0;
}

process.exitCode = main(process.argv.slice(2));
