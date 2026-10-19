#!/usr/bin/env node
/**
 * Process-diagram pre-flight: will this `.diagram.json` import into BO Atlas as the
 * diagram it describes?
 *
 *   node scripts/check-process-diagram.mjs <file.diagram.json> [<export.diagram.json>]
 *
 * WHY THIS EXISTS
 * ---------------
 * Atlas refuses a file outright for six things its schema cannot express: a connector
 * naming a step the file does not define, an annotation attached to one, a step naming a
 * phase or lane the file does not list, a duplicate id, (in a file carrying a complete
 * set of coordinates) a position outside the lane it names, and a phase id in a file that
 * calls itself 1.0. It refuses rather than repairs, because an author who approved six
 * connectors and silently got five has been handed a different process. This script asks
 * the same six questions before the file ever leaves the session, and adds the advisories
 * Atlas does not give: a decision with one exit, a step nothing connects to, a half-set
 * of coordinates that will be ignored.
 *
 * With an export as the second argument it runs in CONTINUATION mode and prints what the
 * Atlas review dialog will say: steps removed (first, and alone, because a removed step
 * takes its triggers, links and work files with it and the file has nothing to put them
 * back), added, renamed and moved; phases added, removed and renamed; lanes added and
 * removed; connectors added and removed. Three things specific to continuation are
 * checked here as well:
 *
 *   - a complete set of coordinates on a file that also added or moved something. Atlas
 *     refuses the moved-step case itself (the fifth check above), but a NEW step with a
 *     complete set carries a position somebody invented, which Atlas honours. The rule is
 *     simpler than the arithmetic: strip every coordinate when anything structural changed.
 *   - a phase id the export wrote and the file dropped. Since schema 1.1 a phase carries
 *     its id (identity, not reference: steps still name a phase by title) and that id is
 *     the only thing that lets a rename be a rename. Export writes it for every phase that
 *     has a stable id and omits it otherwise; the file keeps exactly what the export wrote.
 *   - a phase renamed WITHOUT an id to carry it. Atlas then cannot tell a rename from a
 *     delete plus an add. The steps keep their ids and everything on them; what goes is
 *     anything attached to the phase itself, today an ISO clause mapped to it, which Atlas
 *     drops deliberately and announces in the review dialog.
 *
 * A NOTE ON DUPLICATION
 * ---------------------
 * referenceErrors and the diff below are reimplementations of validateDiagram and
 * diffDiagramExchange (with phaseFor, the id-then-title resolution) in
 *
 *     bo-atlas@3b91f6f:packages/process-core/src/validate/validate-diagram.ts
 *     bo-atlas@3b91f6f:packages/process-core/src/convert/diagram-import.ts
 *
 * read on 2026-10-13 (3b91f6f is PR #108, a renamed phase does not move the steps in it;
 * schema 1.1 came with PR #106 at 4c55803; the fifth check and laneBands in
 * auto-layout.ts with PR #103 at b163f59, all the same day; the four older checks were
 * read at 34b8ac24 on 2026-10-12). Two statements of one behaviour can drift; it is
 * accepted because
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
/** 1.1 adds the optional phase id and nothing else. A file that uses it must say 1.1. */
const VERSIONS = ['1.0', '1.1'];

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
  if (('qcp' in file || 'processPhases' in file) && !('kind' in file)) {
    return [{ path: '', message: 'this is a QCP file, not a diagram file. Atlas refuses it; /bo:qcp is the command for that format' }];
  }
  if (file.kind !== 'bo-atlas-diagram') {
    errors.push({ path: '/kind', message: `expected "bo-atlas-diagram", got ${JSON.stringify(file.kind)}` });
  }
  if (!VERSIONS.includes(file.schema_version)) {
    errors.push({ path: '/schema_version', message: `expected one of ${VERSIONS.map((v) => JSON.stringify(v)).join(', ')}, got ${JSON.stringify(file.schema_version)}` });
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
 * The six reference checks, mirroring validate-diagram.ts
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

  // A phase is REFERENCED by title: that is how a phase is referenced everywhere in the
  // Atlas model, and two phases sharing a title would make every reference ambiguous, so
  // the title refusal stays whether or not the file carries ids. A phase id is IDENTITY,
  // a different job: it lets a rename be a rename. It arrived with 1.1, so a 1.0 file
  // carrying one is refused rather than quietly read.
  const phaseTitles = new Set();
  const phaseIds = new Set();
  file.phases.forEach((phase, i) => {
    if (phaseTitles.has(phase.title)) errors.push({ path: `/phases/${i}/title`, message: `duplicate phase title "${phase.title}"` });
    phaseTitles.add(phase.title);
    if (phase.id === undefined) return;
    if (file.schema_version === '1.0') {
      errors.push({ path: `/phases/${i}/id`, message: `phase "${phase.title}" carries an id, which arrived in schema_version 1.1. Say "1.1", or drop the id` });
    }
    if (phaseIds.has(phase.id)) errors.push({ path: `/phases/${i}/id`, message: `duplicate phase id "${phase.id}"` });
    phaseIds.add(phase.id);
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

  errors.push(...outOfLaneErrors(file, laneIds));

  return errors;
}

/* ------------------------------------------------------------------ *
 * Coordinates, mirroring hasCompleteLayout in diagram-import.ts and
 * laneBands / outOfLaneErrors from bo-atlas PR #103
 * ------------------------------------------------------------------ */

/** The vertical band each lane occupies: the first lane starts under the phase header. */
const PHASE_HEADER_H = 32;

/**
 * Lane id -> { top, bottom }, half-open: top inclusive, bottom exclusive. A lane's top is
 * the phase header plus the sum of the heights above it, which is why every stored y is
 * absolute and why the coordinate set is all-or-nothing.
 */
function laneBands(lanes) {
  const bands = new Map();
  let top = PHASE_HEADER_H;
  for (const lane of lanes) {
    const height = lane.height ?? 0;
    bands.set(lane.id, { top, bottom: top + height });
    top += height;
  }
  return bands;
}

/**
 * The fifth refusal: a position that contradicts the lane it names. Only in a file with a
 * complete set, because that is the only case where Atlas honours positions at all. Only
 * the origin is checked, never the whole box, since a node may legitimately overhang its
 * lane floor in a layout Atlas itself exported. x is deliberately not checked against the
 * phase column: the lane is the parent on the canvas, a phase is a membership, and an
 * author may drag a step clear of its column on purpose.
 */
function outOfLaneErrors(file, laneIds) {
  if (layoutState(file) !== 'complete') return [];
  const errors = [];
  const bands = laneBands(file.lanes);
  const check = (path, label, laneId, position) => {
    if (!laneIds.has(laneId)) return; // already reported as an unknown lane
    const band = bands.get(laneId);
    if (position.y >= band.top && position.y < band.bottom) return;
    errors.push({
      path,
      message: `${label} sits at y ${position.y}, outside lane "${laneId}", which runs from ${band.top} to ${band.bottom}. A step that changed lane needs its position changed too, or no positions at all`,
    });
  };
  file.steps.forEach((s, i) => {
    if (s.position !== undefined) check(`/steps/${i}/position`, `step "${s.id}"`, s.lane, s.position);
  });
  (file.annotations ?? []).forEach((a, i) => {
    if (a.position !== undefined && a.lane !== undefined) check(`/annotations/${i}/position`, `annotation "${a.id}"`, a.lane, a.position);
  });
  return errors;
}

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
    const phaseIds = file.phases.filter((p) => p.id !== undefined).length;
    if (exported.length > 0 || phaseIds > 0) {
      const what = [exported.length > 0 && `${exported.length} step id(s) look like Atlas stable ids`, phaseIds > 0 && `${phaseIds} phase(s) carry an id, which only an export writes`].filter(Boolean).join('; ');
      warnings.push(`${what}. If this file continues an export, pass the export as the second argument to see what the import will change`);
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
  for (const s of file.steps) {
    const was = expSteps.get(s.id);
    if (was === undefined) continue;
    if (was.title !== s.title) stepsRenamed.push({ from: was.title, to: s.title, id: s.id });
  }

  // Phases resolve as phaseFor does in Atlas, three cases in this order: an id matching an
  // export phase id means THAT phase; otherwise a title match; otherwise a new phase. The
  // title fallback is what makes an unmatched id harmless, so adding ids to a file can
  // only preserve more, never less. Keyed by the export phase, whose identity is in question.
  const phaseFor = (phase) => {
    if (phase.id !== undefined) {
      const byId = exp.phases.find((p) => p.id !== undefined && p.id === phase.id);
      if (byId !== undefined) return byId;
    }
    return exp.phases.find((p) => p.title === phase.title);
  };
  const continued = new Map();
  for (const phase of file.phases) {
    const previous = phaseFor(phase);
    if (previous !== undefined && !continued.has(previous)) continued.set(previous, phase);
  }
  const phasesRenamed = [...continued].filter(([was, now]) => was.title !== now.title).map(([was, now]) => ({ from: was.title, to: now.title }));
  const renamedTo = new Set(phasesRenamed.map((r) => r.to));
  const renamedFrom = new Set(phasesRenamed.map((r) => r.from));
  const newTitleOf = new Map(phasesRenamed.map((r) => [r.from, r.to]));

  // A step whose phase was renamed under it has not moved. Without this the dialog would
  // report a phase rename twice and in two voices, once truthfully as a rename and once as
  // every step in it moving to another phase, which an author reads as damage.
  const stepsMoved = [];
  for (const s of file.steps) {
    const was = expSteps.get(s.id);
    if (was === undefined) continue;
    const movedPhase = was.phase !== s.phase && newTitleOf.get(was.phase) !== s.phase;
    if (movedPhase || was.lane !== s.lane) stepsMoved.push(s);
  }

  const expPhases = new Set(exp.phases.map((p) => p.title));
  const filePhases = new Set(file.phases.map((p) => p.title));
  const phasesAdded = file.phases.filter((p) => !expPhases.has(p.title) && !renamedTo.has(p.title)).map((p) => p.title);
  const phasesRemoved = exp.phases.filter((p) => !filePhases.has(p.title) && !renamedFrom.has(p.title)).map((p) => p.title);

  // An id the export wrote and the file lost. Only an export writes a phase id, and only
  // the id lets a rename be a rename; a continued phase that dropped it is still matched
  // by title today, but the next rename will cost whatever is attached to the phase.
  for (const [was, now] of continued) {
    if (was.id !== undefined && now.id !== was.id) {
      warnings.push(`phase "${now.title}" dropped the id "${was.id}" the export wrote${now.id !== undefined ? ` (now "${now.id}")` : ''}. Keep every phase id exactly, and say schema_version "1.1" with it`);
    }
  }

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

  // A phase renamed without an id to carry it: every kept step that sat in a removed phase
  // now sits in one added phase. Atlas then sees a delete plus an add.
  for (const gone of phasesRemoved) {
    const keptFromGone = exp.steps.filter((s) => s.phase === gone && fileSteps.has(s.id));
    if (keptFromGone.length === 0) continue;
    const nowIn = new Set(keptFromGone.map((s) => fileSteps.get(s.id).phase));
    if (nowIn.size === 1) {
      const [target] = nowIn;
      if (phasesAdded.includes(target)) {
        const expPhase = exp.phases.find((p) => p.title === gone);
        const fix = expPhase?.id !== undefined
          ? `Give the renamed phase the id "${expPhase.id}" the export wrote and say schema_version "1.1", and it imports as a rename`
          : `The export wrote no id for it (the phase has no stable id in Atlas), so nothing is attached to it to lose`;
        warnings.push(`phase "${gone}" looks renamed to "${target}" but carries no id to say so. The review dialog will say "removes the phase" and "adds the phase", and Atlas drops anything attached to the phase itself (today an ISO clause mapped to it); the ${keptFromGone.length} step(s) in it keep their ids and count as moved. ${fix}`);
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
      message: `the file keeps a complete set of coordinates but also added or moved ${structural} element(s). Atlas honours the whole set: a moved step left at its old position is refused, and a new step lands at whatever was invented for it. Strip every position, lane height and phase x/width; Atlas will lay the diagram out`,
    });
  }

  return {
    errors,
    warnings,
    diff: {
      stepsRemoved, stepsAdded, stepsRenamed, stepsMoved,
      phasesAdded, phasesRemoved, phasesRenamed, lanesAdded, lanesRemoved, lanesRelabelled,
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
  console.log(`  phases   +${d.phasesAdded.length} -${d.phasesRemoved.length}${d.phasesRemoved.length ? ' (removed: ' + list(d.phasesRemoved, (p) => `"${p}"`) + ')' : ''}${d.phasesRenamed.length ? `, ${d.phasesRenamed.length} renamed: ` + list(d.phasesRenamed, (r) => `"${r.from}" -> "${r.to}"`) : ''}`);
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
  console.log(`  schema ${file.schema_version}; ${counts}; coordinates: ${layoutState(file)}`);

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
