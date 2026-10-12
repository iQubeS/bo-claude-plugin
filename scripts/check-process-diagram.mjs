#!/usr/bin/env node
/**
 * Process-diagram pre-flight: will this `.diagram.json` import into BO Atlas as the
 * diagram it describes?
 *
 *   node scripts/check-process-diagram.mjs <file.diagram.json> [<export.diagram.json>]
 *
 * WHY THIS EXISTS
 * ---------------
 * Atlas refuses a file outright for four things its schema cannot express: a connector
 * naming a step the file does not define, an annotation attached to one, a step naming a
 * phase or lane the file does not list, and a duplicate id. It refuses rather than
 * repairs, because an author who approved six connectors and silently got five has been
 * handed a different process. This script asks the same four questions before the file
 * ever leaves the session, and adds the advisories Atlas does not give: a decision with
 * one exit, a step nothing connects to, a half-set of coordinates that will be ignored.
 *
 * With an export as the second argument it runs in CONTINUATION mode and prints what the
 * Atlas review dialog will say: steps removed (first, and alone, because a removed step
 * takes its triggers, links and work files with it and the file has nothing to put them
 * back), added, renamed and moved; phases and lanes added and removed; connectors added
 * and removed. Two traps specific to continuation are checked here because Atlas does
 * not check them:
 *
 *   - a complete set of coordinates on a file that also added or moved something. Atlas
 *     honours the whole set and writes a moved step at its old position, outside its new
 *     lane. The rule is: strip every coordinate when anything structural changed.
 *   - a renamed phase. Atlas keys phases by title, so a rename is a delete plus a create,
 *     and any phase-scoped ISO mapping on the old phase is orphaned.
 *
 * A NOTE ON DUPLICATION
 * ---------------------
 * referenceErrors and the diff below are reimplementations of validateDiagram and
 * diffDiagramExchange in
 *
 *     bo-atlas@34b8ac24:packages/process-core/src/validate/validate-diagram.ts
 *     bo-atlas@34b8ac24:packages/process-core/src/convert/diagram-import.ts
 *
 * read on 2026-10-12. Two statements of one behaviour can drift; it is accepted because
 * both are small and pure, and because this is a CHECK and never the contract. When the
 * two disagree, Atlas is right and this file is the bug. scripts/check-schema-sync.sh
 * guards the schema; if it reports drift, re-read both files before trusting these results.
 *
 * The schema itself is NOT re-implemented here beyond the enums. Structural validation is
 * the job of ajv (see test/process/README.md); this script assumes a file that already
 * passed.
 *
 * Exit code 0 when the file is import-ready (warnings allowed), 1 otherwise.
 */

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

/* ------------------------------------------------------------------ *
 * Vocabularies, mirroring diagram-exchange-v1.schema.json
 * ------------------------------------------------------------------ */

const SHAPES = ['oval', 'rect', 'diamond', 'document', 'data', 'subprocess', 'manual', 'prep', 'delay', 'store'];
const STYLES = ['solid', 'dashed', 'dotted'];
const ARROWS = ['end', 'both', 'none'];
const KINDS = ['note', 'connector', 'offpage'];

/** Atlas writes stable ids as UUID v4; a file written from scratch never contains one. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** The synthetic id Atlas gives a step that has no stable id. Must survive a round trip. */
const UNLINKED = 'unlinked:';

/* ------------------------------------------------------------------ *
 * Loading
 * ------------------------------------------------------------------ */

function load(path) {
  let text = readFileSync(path, 'utf8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // PowerShell exports carry a BOM
  return JSON.parse(text);
}

/**
 * Enough structure to run the reference checks at all. Anything finer belongs to ajv,
 * and saying so is better than half-validating.
 */
function structuralErrors(file) {
  const errors = [];
  if (file === null || typeof file !== 'object' || Array.isArray(file)) {
    return [{ path: '', message: 'not a JSON object' }];
  }
  if ('qcp' in file && !('kind' in file)) {
    return [{ path: '', message: 'this is a .qcp.json, not a diagram file. Atlas refuses it; /bo:qcp is the command for that format' }];
  }
  if (file.kind !== 'bo-atlas-diagram') {
    errors.push({ path: '/kind', message: `expected "bo-atlas-diagram", got ${JSON.stringify(file.kind)}` });
  }
  if (file.schema_version !== '1.0') {
    errors.push({ path: '/schema_version', message: `expected "1.0", got ${JSON.stringify(file.schema_version)}` });
  }
  for (const key of ['lanes', 'phases', 'steps', 'connectors']) {
    if (!Array.isArray(file[key])) errors.push({ path: `/${key}`, message: 'missing or not an array' });
  }
  if (file.annotations !== undefined && !Array.isArray(file.annotations)) {
    errors.push({ path: '/annotations', message: 'not an array' });
  }
  return errors;
}

/* ------------------------------------------------------------------ *
 * The four reference checks, mirroring validate-diagram.ts
 * ------------------------------------------------------------------ */

function referenceErrors(file) {
  const errors = [];

  const stepIds = new Set();
  file.steps.forEach((step, i) => {
    if (stepIds.has(step.id)) errors.push({ path: `/steps/${i}/id`, message: `duplicate step id "${step.id}"` });
    stepIds.add(step.id);
  });

  const laneIds = new Set();
  file.lanes.forEach((lane, i) => {
    if (laneIds.has(lane.id)) errors.push({ path: `/lanes/${i}/id`, message: `duplicate lane id "${lane.id}"` });
    laneIds.add(lane.id);
  });

  // Phases are keyed by title, not id: that is how a phase is referenced everywhere in
  // the Atlas model, and two phases sharing a title would make every reference ambiguous.
  const phaseTitles = new Set();
  file.phases.forEach((phase, i) => {
    if (phaseTitles.has(phase.title)) errors.push({ path: `/phases/${i}/title`, message: `duplicate phase title "${phase.title}"` });
    phaseTitles.add(phase.title);
  });

  file.steps.forEach((step, i) => {
    if (!phaseTitles.has(step.phase)) {
      errors.push({ path: `/steps/${i}/phase`, message: `step "${step.id}" names phase "${step.phase}", which the file does not list` });
    }
    if (!laneIds.has(step.lane)) {
      errors.push({ path: `/steps/${i}/lane`, message: `step "${step.id}" names lane "${step.lane}", which the file does not list` });
    }
    if (!SHAPES.includes(step.shape)) {
      errors.push({ path: `/steps/${i}/shape`, message: `unknown shape "${step.shape}" (one of ${SHAPES.join(', ')})` });
    }
  });

  file.connectors.forEach((c, i) => {
    if (!stepIds.has(c.from)) errors.push({ path: `/connectors/${i}/from`, message: `no step with id "${c.from}"` });
    if (!stepIds.has(c.to)) errors.push({ path: `/connectors/${i}/to`, message: `no step with id "${c.to}"` });
    if (c.style !== undefined && !STYLES.includes(c.style)) {
      errors.push({ path: `/connectors/${i}/style`, message: `unknown style "${c.style}" (one of ${STYLES.join(', ')})` });
    }
    if (c.arrow !== undefined && !ARROWS.includes(c.arrow)) {
      errors.push({ path: `/connectors/${i}/arrow`, message: `unknown arrow "${c.arrow}" (one of ${ARROWS.join(', ')})` });
    }
  });

  const annotationIds = new Set();
  (file.annotations ?? []).forEach((a, i) => {
    if (annotationIds.has(a.id)) errors.push({ path: `/annotations/${i}/id`, message: `duplicate annotation id "${a.id}"` });
    annotationIds.add(a.id);
    if (!KINDS.includes(a.kind)) {
      errors.push({ path: `/annotations/${i}/kind`, message: `unknown kind "${a.kind}" (one of ${KINDS.join(', ')})` });
    }
    if (a.attached_to !== undefined && !stepIds.has(a.attached_to)) {
      errors.push({ path: `/annotations/${i}/attached_to`, message: `no step with id "${a.attached_to}"` });
    }
    if (a.lane !== undefined && !laneIds.has(a.lane)) {
      errors.push({ path: `/annotations/${i}/lane`, message: `no lane with id "${a.lane}"` });
    }
  });

  return errors;
}

/* ------------------------------------------------------------------ *
 * Coordinates, mirroring hasCompleteLayout in diagram-import.ts
 * ------------------------------------------------------------------ */

/** 'none' | 'partial' | 'complete'. Only 'complete' is honoured by Atlas. */
function layoutState(file) {
  const slots = [
    ...file.steps.map((s) => s.position !== undefined),
    ...(file.annotations ?? []).map((a) => a.position !== undefined),
    ...file.lanes.map((l) => l.height !== undefined),
    ...file.phases.map((p) => p.x !== undefined && p.width !== undefined),
  ];
  if (slots.length === 0 || slots.every((x) => x)) return 'complete';
  if (slots.some((x) => x)) return 'partial';
  return 'none';
}

/* ------------------------------------------------------------------ *
 * Advisories: things Atlas accepts that are probably not what was meant
 * ------------------------------------------------------------------ */

function advisories(file, hasExport) {
  const warnings = [];
  const label = (s) => `"${s.title}" (${s.id})`;

  const layout = layoutState(file);
  if (layout === 'partial') {
    warnings.push('coordinates are present on some elements but not all. Atlas ignores a partial set wholesale and lays the diagram out itself. Strip them all so the file says what will happen');
  }

  const out = new Map();
  const inn = new Map();
  const seenEdge = new Set();
  for (const c of file.connectors) {
    out.set(c.from, (out.get(c.from) ?? 0) + 1);
    inn.set(c.to, (inn.get(c.to) ?? 0) + 1);
    if (c.from === c.to) warnings.push(`connector from "${c.from}" to itself. Atlas would write a step as depending on itself`);
    const key = `${c.from}->${c.to}`;
    if (seenEdge.has(key)) warnings.push(`connector ${key} appears more than once`);
    seenEdge.add(key);
  }

  if (file.steps.length > 1) {
    for (const s of file.steps) {
      if (!out.has(s.id) && !inn.has(s.id)) warnings.push(`step ${label(s)} has no connector in or out`);
    }
  }

  for (const s of file.steps) {
    if (s.shape !== 'diamond') continue;
    const exits = file.connectors.filter((c) => c.from === s.id);
    if (exits.length < 2) warnings.push(`decision ${label(s)} has ${exits.length} outgoing connector(s); a decision needs at least two`);
    const unlabelled = exits.filter((c) => c.label === undefined || c.label.trim() === '');
    if (exits.length >= 2 && unlabelled.length > 0) {
      warnings.push(`decision ${label(s)} has ${unlabelled.length} unlabelled exit(s); say "ja" / "nei" or what the branch means`);
    }
  }

  if (file.steps.length > 0 && !file.steps.some((s) => s.shape === 'oval')) {
    warnings.push('no oval: the diagram has no marked start or end');
  }

  const stepsPerLane = new Map(file.lanes.map((l) => [l.id, 0]));
  const stepsPerPhase = new Map(file.phases.map((p) => [p.title, 0]));
  for (const s of file.steps) {
    stepsPerLane.set(s.lane, (stepsPerLane.get(s.lane) ?? 0) + 1);
    stepsPerPhase.set(s.phase, (stepsPerPhase.get(s.phase) ?? 0) + 1);
  }
  for (const l of file.lanes) if (stepsPerLane.get(l.id) === 0) warnings.push(`lane "${l.label}" (${l.id}) has no steps`);
  for (const p of file.phases) if (stepsPerPhase.get(p.title) === 0) warnings.push(`phase "${p.title}" has no steps`);
  if (file.lanes.length > 7) warnings.push(`${file.lanes.length} lanes; more than seven is hard to read and usually means two processes`);

  if (!hasExport) {
    const exported = file.steps.filter((s) => UUID.test(s.id) || s.id.startsWith(UNLINKED));
    if (exported.length > 0) {
      warnings.push(`${exported.length} step id(s) look like Atlas stable ids. If this file continues an export, pass the export as the second argument to see what the import will change`);
    }
  }

  return warnings;
}

/* ------------------------------------------------------------------ *
 * Continuation, mirroring diffDiagramExchange, in file-id space
 * ------------------------------------------------------------------ */

function continuation(file, exp) {
  const errors = [];
  const warnings = [];
  const expSteps = new Map(exp.steps.map((s) => [s.id, s]));
  const fileSteps = new Map(file.steps.map((s) => [s.id, s]));
  const label = (s) => `"${s.title}" (${s.id})`;

  const stepsAdded = file.steps.filter((s) => !expSteps.has(s.id));
  const stepsRemoved = exp.steps.filter((s) => !fileSteps.has(s.id));
  const stepsRenamed = [];
  const stepsMoved = [];
  for (const s of file.steps) {
    const was = expSteps.get(s.id);
    if (was === undefined) continue;
    if (was.title !== s.title) stepsRenamed.push({ from: was.title, to: s.title, id: s.id });
    if (was.phase !== s.phase || was.lane !== s.lane) stepsMoved.push(s);
  }

  const expPhases = new Set(exp.phases.map((p) => p.title));
  const filePhases = new Set(file.phases.map((p) => p.title));
  const phasesAdded = file.phases.filter((p) => !expPhases.has(p.title)).map((p) => p.title);
  const phasesRemoved = exp.phases.filter((p) => !filePhases.has(p.title)).map((p) => p.title);

  const expLanes = new Map(exp.lanes.map((l) => [l.id, l.label]));
  const fileLanes = new Map(file.lanes.map((l) => [l.id, l.label]));
  const lanesAdded = file.lanes.filter((l) => !expLanes.has(l.id));
  const lanesRemoved = exp.lanes.filter((l) => !fileLanes.has(l.id));
  const lanesRelabelled = file.lanes.filter((l) => expLanes.has(l.id) && expLanes.get(l.id) !== l.label);

  const edgeKey = (c) => `${c.from}->${c.to}`;
  const expEdges = new Set(exp.connectors.map(edgeKey));
  const fileEdges = new Set(file.connectors.map(edgeKey));
  const connectorsAdded = [...fileEdges].filter((e) => !expEdges.has(e)).length;
  const connectorsRemoved = [...expEdges].filter((e) => !fileEdges.has(e)).length;

  // A renamed phase: every kept step that sat in a removed phase now sits in one added
  // phase. Atlas keys phases by title, so this is a delete plus a create.
  for (const gone of phasesRemoved) {
    const keptFromGone = exp.steps.filter((s) => s.phase === gone && fileSteps.has(s.id));
    if (keptFromGone.length === 0) continue;
    const nowIn = new Set(keptFromGone.map((s) => fileSteps.get(s.id).phase));
    if (nowIn.size === 1) {
      const [target] = nowIn;
      if (phasesAdded.includes(target)) {
        warnings.push(`phase "${gone}" looks renamed to "${target}". Atlas keys phases by title, so this imports as a removed phase and a new one: any ISO mapping scoped to "${gone}" is orphaned, and the steps count as moved`);
      }
    }
  }

  // Invented ids that look like stable ids will be treated as new steps anyway, but a
  // reviewer reading the file will assume they continue something.
  for (const s of stepsAdded) {
    if (UUID.test(s.id) || s.id.startsWith(UNLINKED)) {
      warnings.push(`new step ${label(s)} carries an id shaped like an Atlas stable id that the export does not have. It imports as a new step; give it a plain id (s1, s2, ...) so nobody thinks it continues one`);
    }
  }

  const annotationsAdded = (file.annotations ?? []).filter((a) => !(exp.annotations ?? []).some((b) => b.id === a.id)).length;
  const structural = stepsAdded.length + stepsMoved.length + lanesAdded.length + phasesAdded.length + annotationsAdded;
  const layout = layoutState(file);
  if (layout === 'complete' && structural > 0) {
    errors.push({
      path: '',
      message: `the file keeps a complete set of coordinates but also added or moved ${structural} element(s). Atlas honours the whole set, so a moved step keeps its old position outside its new lane and a new step lands at whatever was written for it. Strip every position, lane height and phase x/width; Atlas will lay the diagram out`,
    });
  }

  return {
    errors,
    warnings,
    diff: {
      stepsRemoved, stepsAdded, stepsRenamed, stepsMoved,
      phasesAdded, phasesRemoved, lanesAdded, lanesRemoved, lanesRelabelled,
      connectorsAdded, connectorsRemoved,
      keepsLayout: layout === 'complete',
    },
  };
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

function list(items, render, max = 5) {
  const shown = items.slice(0, max).map(render);
  const rest = items.length - shown.length;
  return shown.join(', ') + (rest > 0 ? `, and ${rest} more` : '');
}

function printDiff(d) {
  console.log('\nContinuation: what the Atlas review dialog will say');
  const stepLabel = (s) => `"${s.title}"`;
  if (d.stepsRemoved.length > 0) {
    console.log(`  REMOVED  ${d.stepsRemoved.length} step(s): ${list(d.stepsRemoved, stepLabel)}`);
    console.log('           each takes its description, links, work files and triggers with it; nothing in the file puts them back');
  } else {
    console.log('  removed  no steps');
  }
  console.log(`  added    ${d.stepsAdded.length} step(s)${d.stepsAdded.length ? ': ' + list(d.stepsAdded, stepLabel) : ''}`);
  console.log(`  renamed  ${d.stepsRenamed.length} step(s)${d.stepsRenamed.length ? ': ' + list(d.stepsRenamed, (r) => `"${r.from}" -> "${r.to}"`) : ''}`);
  console.log(`  moved    ${d.stepsMoved.length} step(s)${d.stepsMoved.length ? ': ' + list(d.stepsMoved, stepLabel) : ''}`);
  console.log(`  phases   +${d.phasesAdded.length} -${d.phasesRemoved.length}${d.phasesRemoved.length ? ' (removed: ' + list(d.phasesRemoved, (p) => `"${p}"`) + ')' : ''}`);
  console.log(`  lanes    +${d.lanesAdded.length} -${d.lanesRemoved.length}${d.lanesRelabelled.length ? `, ${d.lanesRelabelled.length} relabelled` : ''}`);
  console.log(`  lines    +${d.connectorsAdded} -${d.connectorsRemoved}`);
  console.log(`  layout   ${d.keepsLayout ? 'kept: imports as manual arrangement' : 'none: Atlas lays the diagram out, imports as auto'}`);
}

function main(argv) {
  const [filePath, exportPath] = argv;
  if (filePath === undefined) {
    console.error('usage: check-process-diagram.mjs <file.diagram.json> [<export.diagram.json>]');
    return 2;
  }

  let file;
  try {
    file = load(filePath);
  } catch (e) {
    console.error(`${basename(filePath)}: cannot read as JSON: ${e.message}`);
    return 1;
  }

  console.log(`${basename(filePath)}`);
  const errors = structuralErrors(file);
  if (errors.length > 0) {
    for (const e of errors) console.log(`  ERROR ${e.path || '/'}  ${e.message}`);
    console.log('\nnot a diagram file this script can check. Run ajv against the schema for the full story (test/process/README.md)');
    return 1;
  }

  errors.push(...referenceErrors(file));
  const warnings = advisories(file, exportPath !== undefined);

  let diff;
  if (exportPath !== undefined) {
    let exp;
    try {
      exp = load(exportPath);
    } catch (e) {
      console.error(`${basename(exportPath)}: cannot read as JSON: ${e.message}`);
      return 1;
    }
    const expErrors = [...structuralErrors(exp)];
    if (expErrors.length === 0) expErrors.push(...referenceErrors(exp));
    if (expErrors.length > 0) {
      console.log(`\n${basename(exportPath)} (the export) is itself not a valid diagram file:`);
      for (const e of expErrors) console.log(`  ERROR ${e.path || '/'}  ${e.message}`);
      return 1;
    }
    const result = continuation(file, exp);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    diff = result.diff;
  }

  const counts = `${file.lanes.length} lane(s), ${file.phases.length} phase(s), ${file.steps.length} step(s), ${file.connectors.length} connector(s), ${(file.annotations ?? []).length} annotation(s)`;
  console.log(`  ${counts}; coordinates: ${layoutState(file)}`);

  if (errors.length > 0) {
    console.log('\nErrors (Atlas refuses the file, or imports a diagram you did not mean)');
    for (const e of errors) console.log(`  ${e.path || '/'}  ${e.message}`);
  }
  if (warnings.length > 0) {
    console.log('\nWarnings (imports, but look)');
    for (const w of warnings) console.log(`  - ${w}`);
  }
  if (diff !== undefined) printDiff(diff);

  console.log('');
  if (errors.length > 0) {
    console.log(`${errors.length} error(s), ${warnings.length} warning(s): not import-ready`);
    return 1;
  }
  console.log(`0 errors, ${warnings.length} warning(s): import-ready`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
