#!/usr/bin/env node
/**
 * RA pre-flight: will this authored template import without hand reconciliation?
 *
 *   node scripts/check-ra-vocabulary.mjs <template.ra.json> <ra-vocabulary-manifest.json>
 *
 * WHY THIS EXISTS
 * ---------------
 * The importer's reconciliation screen is the feedback loop today: author a file,
 * upload it, discover six terms this tenant has never heard of, go back. That round
 * trip is avoidable, because resolution is deterministic and dependency-free.
 *
 * bo-ra's own test suite sets the bar (tests/templateJsonExamples.test.ts): the
 * published example "needs no reconciliation against the manifest beside it". This
 * script asserts the same property for a file /bo:risk just produced, before the file
 * ever leaves the session.
 *
 * A NOTE ON DUPLICATION
 * ---------------------
 * normalise / similarity / resolveExact / suggestMatch / resolveLevel below are
 * reimplementations of the functions of the same names in
 *
 *     bo-ra@3f1140ab:src/services/templateJson.ts
 *
 * read on 2026-08-17. That is a real cost: two statements of one behaviour can drift.
 * It is accepted because the functions are small, pure and fully specified, and because
 * this is a CHECK and never the contract — when the two disagree, bo-ra is right and
 * this file is the bug. scripts/check-schema-sync.sh guards the schema; if it reports
 * drift, re-read templateJson.ts before trusting these results.
 *
 * Deliberately not implemented: any fallback that applies a suggestion. Upstream removed
 * exactly that (an unrecognised exposureTarget once silently became "Personnel") because
 * a bad guess produced the strictest reading with nobody deciding. Similarity suggests;
 * it never resolves.
 *
 * Exit code 0 when the file is import-ready (warnings allowed), 1 otherwise.
 */

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

/* ------------------------------------------------------------------ *
 * Matching — mirrors bo-ra src/services/templateJson.ts
 * ------------------------------------------------------------------ */

/** Case, surrounding space and internal runs of space are never meaningful. */
const normalise = (value) => value.trim().toLowerCase().replace(/\s+/g, ' ');

const bigrams = (s) => {
  const out = [];
  for (let i = 0; i < s.length - 1; i += 1) out.push(s.slice(i, i + 2));
  return out;
};

/** Dice coefficient over character bigrams, 0..1. Suggestions only. */
function similarity(a, b) {
  const x = normalise(a);
  const y = normalise(b);
  if (x.length === 0 || y.length === 0) return 0;
  if (x === y) return 1;
  if (x.length === 1 || y.length === 1) return 0;
  const left = bigrams(x);
  const right = bigrams(y);
  const pool = right.slice();
  let hits = 0;
  for (const gram of left) {
    const at = pool.indexOf(gram);
    if (at !== -1) {
      pool.splice(at, 1); // consumed, so a repeated bigram cannot count twice
      hits += 1;
    }
  }
  return (2 * hits) / (left.length + right.length);
}

/** Key first, then English name, then Norwegian. Nothing fuzzy. */
function resolveExact(value, candidates) {
  const v = normalise(value);
  return (
    candidates.find((c) => normalise(c.key) === v) ||
    candidates.find((c) => normalise(c.name) === v) ||
    candidates.find((c) => c.nameNb !== undefined && normalise(c.nameNb) === v)
  );
}

/** Closest candidate and how close, for a value that did not resolve. Never applied. */
function suggestMatch(value, candidates) {
  let best;
  for (const candidate of candidates) {
    const score = Math.max(
      similarity(value, candidate.name),
      similarity(value, candidate.key),
      candidate.nameNb === undefined ? 0 : similarity(value, candidate.nameNb)
    );
    if (best === undefined || score > best.score) best = { candidate, score };
  }
  // Below 0.34 the "closest" match is noise, and offering it invites a wrong
  // confirmation. Silence is the better suggestion.
  return best !== undefined && best.score >= 0.34 ? best : undefined;
}

/** Label first, ordinal second. A level the axis lacks is refused, never clamped. */
function resolveLevel(raw, axis) {
  if (typeof raw === 'number') {
    const found = axis.find((a) => a.level === raw);
    if (found === undefined) {
      return {
        error: `level ${raw} does not exist on this axis (it runs ${axis.map((a) => a.level).join(', ')})`,
      };
    }
    return { level: found.level, byLabel: false };
  }
  const byLabel = axis.find((a) => normalise(a.label) === normalise(raw));
  if (byLabel !== undefined) return { level: byLabel.level, byLabel: true };
  const asNumber = Number(raw);
  if (raw.length > 0 && !Number.isNaN(asNumber)) return resolveLevel(asNumber, axis);
  return { error: `"${raw}" matches no level on this axis` };
}

/**
 * The manifest carries no category ids, deliberately, so index+1 stands one in — the
 * same substitution bo-ra's own example test makes. `nameNb` carries the standard, so
 * "ISO 45001" resolves as readily as "Health".
 */
const categoryCandidates = (categories) =>
  categories.map((c, i) => ({ key: String(i + 1), name: c.name, nameNb: c.standard }));

/**
 * Did this value resolve via the category's *standard* rather than its name?
 *
 * The importer accepts "ISO 45001" as an alias for "Health", which is convenient until
 * two categories declare the same standard: Finance and Reputation both answer to
 * ISO 31000 on the reference tenant, and resolveExact takes the first array hit. The
 * file then means something the author did not write, silently and without a warning
 * anywhere in the import. Naming the category is always unambiguous, so say so.
 */
function matchedByStandard(value, hit) {
  if (hit === undefined || hit.nameNb === undefined) return false;
  const v = normalise(value);
  return v !== normalise(hit.name) && v !== normalise(hit.key) && v === normalise(hit.nameNb);
}

/* ------------------------------------------------------------------ *
 * Reading
 * ------------------------------------------------------------------ */

function fail(message) {
  process.stderr.write(`\n  ${message}\n\n`);
  process.exit(1);
}

/**
 * The manifest is produced by PowerShell and may carry a UTF-8 BOM, which JSON.parse
 * refuses. An editor strips it silently; this must not pretend it was never there.
 */
function readJson(path, label) {
  let raw;
  try {
    raw = readFileSync(path, 'utf8');
  } catch (e) {
    fail(`Cannot read the ${label} at ${path}: ${e.message}`);
  }
  try {
    return JSON.parse(raw.replace(/^﻿/, ''));
  } catch (e) {
    fail(`The ${label} is not valid JSON: ${e.message}`);
  }
}

/* ------------------------------------------------------------------ *
 * Structural pre-check — the subset that refuses the whole file
 * ------------------------------------------------------------------ */

const ALLOWED = {
  root: ['$schema', 'version', 'template', 'activities'],
  template: ['name', 'description'],
  activity: ['name', 'description', 'effectCategories', 'risks'],
  risk: [
    'event',
    'cause',
    'consequence',
    'riskSource',
    'exposureTarget',
    'minimumPpe',
    'inherentScores',
    'barriers',
  ],
  score: ['effectCategory', 'consequence', 'probability'],
  barrier: ['name', 'type', 'description'],
};

/**
 * Execution evidence, refused outright on an imported barrier.
 *
 * R28 splits a barrier in two: what the control *is* travels, but any claim that it is
 * actually in place does not — that belongs to the project that adopts the template, not
 * to whoever authored it. Naming these separately from "unknown property" matters,
 * because an author who writes `status: "Implemented"` has made a category error rather
 * than a typo, and the message should say which.
 */
const EVIDENCE_KEYS = ['status', 'verifiedDate', 'verifiedBy', 'documentReference'];

const BARRIER_TYPES = ['Elimination', 'Substitution', 'Technical', 'Organisational', 'Ppe'];

const isRecord = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

function unknownKeys(record, allowed, at, errors) {
  for (const key of Object.keys(record)) {
    if (allowed.includes(key)) continue;
    if (key === 'residualScores' || key === 'scores') continue; // own message below
    errors.push(`${at}.${key} is not part of this format. Check the spelling, or remove it.`);
  }
}

function structuralErrors(file) {
  const errors = [];
  if (!isRecord(file)) return ['The file must contain a JSON object.'];
  unknownKeys(file, ALLOWED.root, 'root', errors);
  if (file.version !== 1) {
    errors.push(`Unsupported format version ${JSON.stringify(file.version)}. This format is version 1.`);
  }
  if (!isRecord(file.template)) errors.push('template is required.');
  else {
    unknownKeys(file.template, ALLOWED.template, 'template', errors);
    if (typeof file.template.name !== 'string' || file.template.name.trim() === '') {
      errors.push('template.name is required.');
    }
  }
  if (!Array.isArray(file.activities)) errors.push('activities must be an array.');
  else if (file.activities.length === 0) errors.push('activities is empty; there is nothing to import.');

  (Array.isArray(file.activities) ? file.activities : []).forEach((activity, ai) => {
    const at = `activities[${ai}]`;
    if (!isRecord(activity)) {
      errors.push(`${at} must be an object.`);
      return;
    }
    unknownKeys(activity, ALLOWED.activity, at, errors);
    if (typeof activity.name !== 'string' || activity.name.trim() === '') {
      errors.push(`${at}.name is required.`);
    }
    (Array.isArray(activity.risks) ? activity.risks : []).forEach((risk, ri) => {
      const rt = `${at}.risks[${ri}]`;
      if (!isRecord(risk)) {
        errors.push(`${rt} must be an object.`);
        return;
      }
      unknownKeys(risk, ALLOWED.risk, rt, errors);
      if (typeof risk.event !== 'string' || risk.event.trim() === '') {
        errors.push(`${rt}.event is required; it is what the risk is.`);
      }
      if (risk.residualScores !== undefined || risk.scores !== undefined) {
        errors.push(
          `${rt}: only inherentScores are accepted. A residual score needs a barrier to justify it, and barriers are not imported.`
        );
      }
      if (risk.barriers !== undefined && !Array.isArray(risk.barriers)) {
        errors.push(`${rt}.barriers must be an array when present.`);
      }
      (Array.isArray(risk.barriers) ? risk.barriers : []).forEach((barrier, bi) => {
        const bt = `${rt}.barriers[${bi}]`;
        if (!isRecord(barrier)) {
          errors.push(`${bt} must be an object.`);
          return;
        }
        for (const k of EVIDENCE_KEYS) {
          if (barrier[k] !== undefined) {
            errors.push(
              `${bt}.${k} cannot be set here. Every imported barrier arrives planned; whether a control is actually in place is recorded by the project that adopts the template (R28).`
            );
          }
        }
        // Evidence keys already got their own, better message above; reporting them a
        // second time as "unknown property" would bury the reason they are refused.
        unknownKeys(
          Object.fromEntries(Object.entries(barrier).filter(([k]) => !EVIDENCE_KEYS.includes(k))),
          ALLOWED.barrier,
          bt,
          errors
        );
        if (typeof barrier.name !== 'string' || barrier.name.trim() === '') {
          errors.push(`${bt}.name is required; a barrier is a reference into the library.`);
        }
        if (barrier.type !== undefined && !BARRIER_TYPES.includes(barrier.type)) {
          errors.push(
            `${bt}.type ${JSON.stringify(barrier.type)} is not one of ${BARRIER_TYPES.join(', ')}.`
          );
        }
      });
      (Array.isArray(risk.inherentScores) ? risk.inherentScores : []).forEach((score, si) => {
        const st = `${rt}.inherentScores[${si}]`;
        if (!isRecord(score)) {
          errors.push(`${st} must be an object.`);
          return;
        }
        unknownKeys(score, ALLOWED.score, st, errors);
        for (const k of ['effectCategory', 'consequence', 'probability']) {
          if (score[k] === undefined) errors.push(`${st}.${k} is required.`);
        }
      });
    });
  });
  return errors;
}

/* ------------------------------------------------------------------ *
 * Reporting helpers
 * ------------------------------------------------------------------ */

const lines = [];
const say = (s = '') => lines.push(s);
const mark = (state, text) => say(`  ${state.padEnd(5)} ${text}`);
const detail = (text) => say(`        ${text}`);
const q = (s) => `"${s}"`;
const flush = () => process.stdout.write(lines.join('\n') + '\n');

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

const [templatePath, manifestPath] = process.argv.slice(2);
if (!templatePath || !manifestPath) {
  process.stderr.write(
    '\n  usage: node scripts/check-ra-vocabulary.mjs <template.ra.json> <ra-vocabulary-manifest.json>\n\n'
  );
  process.exit(2);
}

const file = readJson(templatePath, 'template');
const manifest = readJson(manifestPath, 'manifest');

say();
say(`RA pre-flight -- ${basename(templatePath)} against ${basename(manifestPath)}`);
say();

/* ---- The manifest itself ---- */

const manifestProblems = [];
if (manifest.version !== 1) {
  manifestProblems.push(`version is ${JSON.stringify(manifest.version)}, expected 1`);
}
if (!Array.isArray(manifest.effectCategories) || manifest.effectCategories.length === 0) {
  manifestProblems.push('effectCategories is missing or empty');
}
for (const c of manifest.effectCategories ?? []) {
  if (!Array.isArray(c.consequenceLevels) || c.consequenceLevels.length === 0) {
    manifestProblems.push(`category ${q(c.name)} has no consequenceLevels`);
  }
  if (!Array.isArray(c.probabilityLevels) || c.probabilityLevels.length === 0) {
    manifestProblems.push(`category ${q(c.name)} has no probabilityLevels`);
  }
}
// The acceptance limit and band colours are deliberately absent from a manifest: an
// author who can see where the limit sits is tempted to score the outcome rather than
// the hazard. If an export ever starts leaking them, say so loudly.
const serialised = JSON.stringify(manifest);
if (/acceptanceLimit|bandRank/i.test(serialised) || /"colou?r"|#[0-9a-f]{6}/i.test(serialised)) {
  manifestProblems.push(
    'this export leaks an acceptance limit or band colours, which a manifest must not carry -- do not author against it'
  );
}

if (manifestProblems.length > 0) {
  mark('FAIL', 'the manifest is not usable as a dictionary');
  for (const p of manifestProblems) detail(p);
  say();
  flush();
  process.stderr.write('  Re-export it with Copy vocabulary from the destination tenant.\n\n');
  process.exit(1);
}

const cats = categoryCandidates(manifest.effectCategories);
const sharedStandards = new Set(
  manifest.effectCategories
    .map((c) => normalise(c.standard))
    .filter((s, _i, all) => all.filter((x) => x === s).length > 1)
);
/** One warning line for a category named by standard, sharper when the alias is ambiguous. */
const standardWarning = (value, hit, at) =>
  sharedStandards.has(normalise(value))
    ? `${at} names its category by the standard ${q(value)}, which ${manifest.effectCategories.filter((c) => normalise(c.standard) === normalise(value)).length} categories share -- it resolves to ${q(hit.name)} by array order, not by intent. Write the category name.`
    : `${at} names its category by the standard ${q(value)} rather than ${q(hit.name)} -- the name is unambiguous, the standard may stop being so`;

const library = manifest.barrierLibrary ?? [];
const hasLibrary = Array.isArray(manifest.barrierLibrary);
const sizes = [...new Set(manifest.effectCategories.map((c) => c.matrixType))].join(', ');
mark(
  'ok',
  `manifest: ${manifest.effectCategories.length} categories (${sizes}), ` +
    `${(manifest.riskSources ?? []).length} risk sources, ` +
    `${(manifest.exposureTargets ?? []).length} exposure targets, ` +
    `${hasLibrary ? `${library.length} barriers` : 'no barrierLibrary'}`
);

/* ---- Structure ---- */

const structural = structuralErrors(file);
if (structural.length > 0) {
  mark('FAIL', `${structural.length} structural problem(s) -- the importer refuses the whole file`);
  for (const e of structural) detail(e);
  say();
  flush();
  process.stderr.write('  Fix the structure first; nothing else can be checked until the file parses.\n\n');
  process.exit(1);
}

const activityCount = file.activities.length;
const riskCount = file.activities.reduce((n, a) => n + (a.risks?.length ?? 0), 0);
const scoreCount = file.activities.reduce(
  (n, a) => n + (a.risks ?? []).reduce((m, r) => m + (r.inherentScores?.length ?? 0), 0),
  0
);
const barrierCount = file.activities.reduce(
  (n, a) => n + (a.risks ?? []).reduce((m, r) => m + (r.barriers?.length ?? 0), 0),
  0
);
mark(
  'ok',
  `template: ${activityCount} activities, ${riskCount} risks, ${scoreCount} scores, ${barrierCount} barriers`
);
mark('ok', 'structure readable, no unknown keys, no residual score');

/* ---- Vocabulary and levels ---- */

const counts = new Map();
const bump = (kind, value) => {
  const id = `${kind}::${normalise(value)}`;
  const existing = counts.get(id);
  if (existing === undefined) counts.set(id, { kind, value, count: 1 });
  else existing.count += 1;
};

const levelErrors = [];
const warnings = [];
let ordinalLevels = 0;
let blankRiskSource = 0;
let blankExposureTarget = 0;
let unscoredRisks = 0;
let unbarrieredRisks = 0;
let redundantTypes = 0;
let ignoredDescriptions = 0;
const proposedNew = new Set();

file.activities.forEach((activity, ai) => {
  const at = `activities[${ai}]`;
  const listed = new Set();
  for (const name of activity.effectCategories ?? []) {
    const hit = resolveExact(name, cats);
    if (hit === undefined) bump('effectCategory', name);
    else listed.add(hit.name);
    if (/^\d+$/.test(String(name).trim())) {
      warnings.push(
        `${at}.effectCategories names category ${q(name)} by number -- ids do not travel between tenants`
      );
    } else if (matchedByStandard(name, hit)) {
      warnings.push(standardWarning(name, hit, `${at}.effectCategories`));
    }
  }
  if ((activity.effectCategories ?? []).length === 0) {
    warnings.push(
      `${at} (${q(activity.name)}) lists no effectCategories -- its risks are unscorable until set by hand`
    );
  }

  (activity.risks ?? []).forEach((risk, ri) => {
    const rt = `${at}.risks[${ri}]`;

    if (risk.riskSource === undefined) blankRiskSource += 1;
    else if (resolveExact(risk.riskSource, manifest.riskSources ?? []) === undefined) {
      bump('riskSource', risk.riskSource);
    }

    if (risk.exposureTarget === undefined) blankExposureTarget += 1;
    else if (resolveExact(risk.exposureTarget, manifest.exposureTargets ?? []) === undefined) {
      bump('exposureTarget', risk.exposureTarget);
    }

    if ((risk.inherentScores ?? []).length === 0) unscoredRisks += 1;

    const barriers = risk.barriers ?? [];
    if (barriers.length === 0) unbarrieredRisks += 1;
    // Two to four is the working range. A risk listing ten makes the actions view
    // unusable, which is the opposite of what grouping barriers is for.
    if (barriers.length > 4) {
      warnings.push(
        `${rt} lists ${barriers.length} barriers -- two to four is the working range; beyond that the actions view stops being usable`
      );
    }
    barriers.forEach((barrier, bi) => {
      const bt = `${rt}.barriers[${bi}]`;
      const hit = resolveExact(barrier.name, library);
      if (hit === undefined) {
        bump('barrier', barrier.name);
        proposedNew.add(normalise(barrier.name));
        // A barrier the library does not hold needs a type, because adding it to the
        // library needs one the library cannot supply.
        if (barrier.type === undefined) {
          warnings.push(
            `${bt} proposes ${q(barrier.name)}, which the library does not hold, but supplies no type -- it would default to Organisational, which can never justify a severity reduction (R3)`
          );
        }
        if (barrier.description === undefined) {
          warnings.push(
            `${bt} proposes ${q(barrier.name)} with no description -- if the manager adds it, the entry is created with none`
          );
        }
        return;
      }
      // The library entry's own wording is what lands on the risk, so restating it here
      // achieves nothing and invites two sentences for one control.
      if (barrier.description !== undefined) {
        ignoredDescriptions += 1;
      }
      if (barrier.type !== undefined && barrier.type === hit.suggestedType) {
        redundantTypes += 1;
      }
    });

    (risk.inherentScores ?? []).forEach((score, si) => {
      const st = `${rt}.inherentScores[${si}]`;
      const hit = resolveExact(score.effectCategory, cats);
      if (hit === undefined) {
        bump('effectCategory', score.effectCategory);
        return; // cannot check levels without an axis
      }
      if (/^\d+$/.test(String(score.effectCategory).trim())) {
        warnings.push(`${st} names its category by number -- ids do not travel between tenants`);
      } else if (matchedByStandard(score.effectCategory, hit)) {
        warnings.push(standardWarning(score.effectCategory, hit, st));
      }
      // The importer writes this score regardless, but the activity is not assessed
      // against that category, so nothing in the UI will show it.
      if (!listed.has(hit.name)) {
        warnings.push(
          `${st} scores ${q(hit.name)}, which ${at} does not list in effectCategories -- it lands where no column shows it`
        );
      }
      const category = manifest.effectCategories.find((c) => c.name === hit.name);
      const where = `${rt} (${hit.name})`;
      const c = resolveLevel(score.consequence, category.consequenceLevels);
      const p = resolveLevel(score.probability, category.probabilityLevels);
      if (c.error) levelErrors.push(`${where}: consequence ${c.error}`);
      if (p.error) levelErrors.push(`${where}: probability ${p.error}`);
      if (c.byLabel === false) ordinalLevels += 1;
      if (p.byLabel === false) ordinalLevels += 1;
    });
  });
});

const candidatesFor = (kind) => {
  if (kind === 'riskSource') return manifest.riskSources ?? [];
  if (kind === 'exposureTarget') return manifest.exposureTargets ?? [];
  if (kind === 'barrier') return library;
  return cats;
};

const unresolved = [...counts.values()]
  .map((u) => ({ ...u, suggestion: suggestMatch(u.value, candidatesFor(u.kind)) }))
  // Heaviest first: the decision affecting twelve risks belongs at the top.
  .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

if (unresolved.length === 0) {
  mark('ok', 'every risk source, exposure target and effect category resolves');
} else {
  const uses = unresolved.reduce((n, u) => n + u.count, 0);
  mark('FAIL', `${unresolved.length} vocabulary term(s) do not resolve, across ${uses} use(s)`);
  if (unresolved.some((u) => u.kind === 'barrier')) {
    detail(
      'note: an unresolved barrier is NOT created if left blank at reconciliation --'
    );
    detail(
      '      unlike a risk source, whose risk still imports. There is no third option.'
    );
  }
  for (const u of unresolved) {
    detail(`${u.kind.padEnd(14)} ${q(u.value).padEnd(38)} ${u.count} use${u.count === 1 ? '' : 's'}`);
    detail(
      u.suggestion
        ? `${''.padEnd(14)} closest: ${u.suggestion.candidate.name} (${u.suggestion.score.toFixed(2)})`
        : `${''.padEnd(14)} no candidate close enough to suggest`
    );
  }
}

if (levelErrors.length === 0) {
  mark('ok', "every level exists on its own category's axis");
} else {
  mark('FAIL', `${levelErrors.length} level(s) do not exist on the destination axis -- refused, never clamped`);
  for (const e of levelErrors) detail(e);
}

/* ---- Advisory ---- */

if (ordinalLevels > 0) {
  warnings.push(
    `${ordinalLevels} level(s) given as a number rather than a label -- a label states meaning, a number only states position`
  );
}
if (blankRiskSource > 0) {
  warnings.push(`${blankRiskSource} risk(s) carry no riskSource -- each appears under no portfolio grouping`);
}
if (blankExposureTarget > 0) {
  warnings.push(`${blankExposureTarget} risk(s) carry no exposureTarget`);
}
if (unscoredRisks > 0) {
  warnings.push(`${unscoredRisks} risk(s) carry no inherentScores -- they import unscored`);
}
if (barrierCount > 0 && !hasLibrary) {
  warnings.push(
    `this manifest carries no barrierLibrary, so none of the ${barrierCount} barrier(s) can resolve -- re-export the vocabulary from a tenant with barrier support`
  );
}
if (unbarrieredRisks > 0) {
  warnings.push(
    `${unbarrieredRisks} risk(s) carry no barriers -- legitimate, and the product reports an uncontrolled risk as a finding, but check it is a decision rather than an omission`
  );
}
if (ignoredDescriptions > 0) {
  warnings.push(
    `${ignoredDescriptions} barrier(s) restate a description the library already holds -- the library's wording wins, so it is ignored (R24)`
  );
}
if (redundantTypes > 0) {
  warnings.push(
    `${redundantTypes} barrier(s) set a type identical to the library's suggestedType -- omit it unless you mean to override`
  );
}
if (proposedNew.size >= 5) {
  warnings.push(
    `${proposedNew.size} new library entries proposed -- each is a decision the manager makes one at a time, and a file proposing this many tends to be abandoned rather than reconciled`
  );
}

if (warnings.length > 0) {
  mark('warn', `${warnings.length} thing(s) worth a look`);
  for (const w of warnings) detail(w);
}

/* ---- Verdict ---- */

const ready = unresolved.length === 0 && levelErrors.length === 0;
say();
say(
  ready
    ? '  Import-ready: nothing for the manager to reconcile by hand.'
    : '  Not import-ready: the manager would be asked to reconcile this by hand.'
);
say();

flush();
process.exit(ready ? 0 : 1);
