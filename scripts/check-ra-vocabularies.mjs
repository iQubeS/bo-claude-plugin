#!/usr/bin/env node
/**
 * Vocabulary pre-flight: will this maintenance file import into the three writable
 * lists as the additions and updates it describes?
 *
 *   node scripts/check-ra-vocabularies.mjs <file.vocabularies.json> [<ra-vocabularies.json export>]
 *
 * WHY THIS EXISTS
 * ---------------
 * bo-ra's "Import vocabularies" validates every row before it writes anything and then
 * shows a preview, so a bad file is caught -- but only after the QHSE manager has opened
 * BO, chosen the file and read a list of refusals. This script asserts the same rules on
 * the file before it leaves the session, and with the tenant's own export beside it says
 * what the preview will show: which rows are creates, which are updates and what each
 * update changes.
 *
 * WHAT IT MIRRORS
 * ---------------
 * The rules are taken from the handoff for bo-ra's vocabulary maintenance exchange
 * (format `bo-ra-vocabularies`, version 1), read 2026-11-16, not from its source, which
 * is not published yet. When bo-ra's parser (src/services/vocabularyTransfer.ts) and
 * this file disagree, bo-ra is right and this file is the bug. The structural subset is
 * also stated in assets/vocabulary/ra-vocabularies.schema-v1.json.
 *
 * Deliberately not implemented: any fuzzy matching that RESOLVES a row. A name that
 * resembles an existing entry under another key is a warning for a person, never a
 * merge, because the import matches on (kind, key) and nothing else.
 *
 * Exit code 0 when the file is import-ready (warnings allowed), 1 otherwise.
 */

import { readFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';

/* ------------------------------------------------------------------ *
 * The contract
 * ------------------------------------------------------------------ */

const FORMAT = 'bo-ra-vocabularies';
const VERSION = 1;
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_ENTRIES = 5000;
const TEXT_MAX = 255;
const NOTE_MAX = 63999;
const KEY_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DANGEROUS_NAMES = ['__proto__', 'constructor', 'prototype'];

/** The three lists the import can write. Everything else is reported and never sent. */
const WRITABLE = ['riskSources', 'barrierLibrary', 'complianceObligations'];
const EXPORT_ONLY = ['exposureTargets', 'frequencyLevels', 'exclusionReasons', 'significanceCriteria'];

const COMMON_FIELDS = ['key', 'name', 'nameNb', 'active', 'sortOrder'];
const KIND_FIELDS = {
  riskSources: [],
  barrierLibrary: [
    'description',
    'suggestedType',
    'suggestedFunction',
    'performanceRequirement',
    'verificationIntervalDays',
    'documentReference',
  ],
  complianceObligations: ['obligationType', 'reference', 'jurisdiction'],
  exposureTargets: ['harmsPeople'],
  frequencyLevels: [],
  exclusionReasons: ['requiresReference', 'requiresFreeText'],
  significanceCriteria: ['environmental', 'threshold'],
};
const ENUMS = {
  suggestedType: ['Elimination', 'Substitution', 'Technical', 'Organisational', 'Ppe'],
  suggestedFunction: ['Preventing', 'Mitigating', 'Both'],
  obligationType: ['Legal', 'Permit', 'Contractual', 'Voluntary'],
};
/** Text fields bounded to a SharePoint single-line column. */
const NOTE_FIELDS = ['description', 'performanceRequirement'];
const BOOLEAN_FIELDS = ['active', 'harmsPeople', 'requiresReference', 'requiresFreeText', 'environmental'];

/** Required on every row of the kind, sparse update or not. */
const REQUIRED = {
  riskSources: ['key', 'name'],
  barrierLibrary: ['key', 'name', 'description'],
  complianceObligations: ['key', 'name'],
};

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const isRecord = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
const normalise = (value) => String(value).trim().toLowerCase().replace(/\s+/g, ' ');
const q = (s) => `"${s}"`;

const bigrams = (s) => {
  const out = [];
  for (let i = 0; i < s.length - 1; i += 1) out.push(s.slice(i, i + 2));
  return out;
};

/** Dice coefficient over character bigrams, as in check-ra-vocabulary.mjs. Suggests only. */
function similarity(a, b) {
  const x = normalise(a);
  const y = normalise(b);
  if (x.length === 0 || y.length === 0) return 0;
  if (x === y) return 1;
  if (x.length === 1 || y.length === 1) return 0;
  const left = bigrams(x);
  const pool = bigrams(y);
  let hits = 0;
  for (const gram of left) {
    const at = pool.indexOf(gram);
    if (at !== -1) {
      pool.splice(at, 1);
      hits += 1;
    }
  }
  return (2 * hits) / (left.length + pool.length + hits);
}

function fail(message) {
  process.stderr.write(`\n  ${message}\n\n`);
  process.exit(1);
}

/** Strips a UTF-8 BOM, which a PowerShell-made file may carry and JSON.parse refuses. */
function readJson(path, label) {
  let raw;
  try {
    if (statSync(path).size > MAX_BYTES) {
      fail(`The ${label} at ${path} is larger than 5 MiB; the importer refuses it rather than truncating.`);
    }
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

/**
 * The template-authoring manifest and the maintenance export overlap in property
 * names, which is exactly why one gets handed in for the other. Name the mistake.
 */
function looksLikeManifest(file) {
  return isRecord(file) && file.format === undefined && Array.isArray(file.effectCategories);
}

/* ------------------------------------------------------------------ *
 * Structural validation -- the subset the importer refuses outright
 * ------------------------------------------------------------------ */

function envelopeErrors(file, label) {
  const errors = [];
  if (!isRecord(file)) return [`The ${label} must contain a JSON object.`];
  if (looksLikeManifest(file)) {
    return [
      `The ${label} is the template-authoring manifest (ra-vocabulary-manifest.json), not a vocabulary file. ` +
        `Import vocabularies reads the Export all vocabularies file, format ${q(FORMAT)}; the manifest is authoring context for /bo:risk and cannot be imported.`,
    ];
  }
  if (file.format !== FORMAT) {
    errors.push(`format is ${JSON.stringify(file.format)}, expected ${q(FORMAT)}.`);
  }
  if (file.version !== VERSION) {
    errors.push(`version is ${JSON.stringify(file.version)}, expected ${VERSION}.`);
  }
  for (const key of Object.keys(file)) {
    if (!['format', 'version', 'vocabularies'].includes(key)) {
      errors.push(`root.${key} is not part of this format.`);
    }
  }
  if (!isRecord(file.vocabularies)) {
    errors.push('vocabularies must be an object.');
    return errors;
  }
  for (const section of Object.keys(file.vocabularies)) {
    if (DANGEROUS_NAMES.includes(section)) {
      errors.push(`vocabularies.${section} is not an acceptable section name.`);
    } else if (!WRITABLE.includes(section) && !EXPORT_ONLY.includes(section)) {
      errors.push(
        `vocabularies.${section} is not a known section. Known: ${[...WRITABLE, ...EXPORT_ONLY].join(', ')}.`
      );
    }
    const envelope = file.vocabularies[section];
    if (!isRecord(envelope)) {
      errors.push(`vocabularies.${section} must be an object with "source" and "entries".`);
      continue;
    }
    for (const k of Object.keys(envelope)) {
      if (!['source', 'entries'].includes(k)) errors.push(`vocabularies.${section}.${k} is not part of the envelope.`);
    }
    if (envelope.source !== undefined && !['stored', 'seed'].includes(envelope.source)) {
      errors.push(`vocabularies.${section}.source is ${JSON.stringify(envelope.source)}, expected "stored" or "seed".`);
    }
    if (!Array.isArray(envelope.entries)) {
      errors.push(`vocabularies.${section}.entries must be an array.`);
    }
  }
  return errors;
}

function checkText(value, at, max, errors) {
  if (typeof value !== 'string') {
    errors.push(`${at} must be a string.`);
    return;
  }
  if (value.trim() === '') {
    errors.push(`${at} is blank. Omit the field to preserve the destination value, or write null to clear it; an empty string is refused.`);
  } else if (value.length > max) {
    errors.push(`${at} is ${value.length} characters; the destination column holds ${max}.`);
  }
}

/** Row-level rules for a writable kind. */
function entryErrors(kind, entry, at, errors) {
  if (!isRecord(entry)) {
    errors.push(`${at} must be an object.`);
    return;
  }
  const allowed = [...COMMON_FIELDS, ...KIND_FIELDS[kind]];
  for (const field of Object.keys(entry)) {
    if (DANGEROUS_NAMES.includes(field)) {
      errors.push(`${at}.${field} is not an acceptable field name.`);
      continue;
    }
    if (allowed.includes(field)) continue;
    const elsewhere = Object.entries(KIND_FIELDS).find(([k, f]) => k !== kind && f.includes(field));
    errors.push(
      elsewhere
        ? `${at}.${field} belongs to ${elsewhere[0]}, not ${kind}.`
        : `${at}.${field} is not part of this format. Check the spelling, or remove it.`
    );
  }
  for (const field of REQUIRED[kind]) {
    if (entry[field] === undefined || entry[field] === null) {
      errors.push(
        `${at}.${field} is required on every ${kind} row, sparse update or not` +
          (field === 'description' ? ' -- a barrier without wording cannot land on a risk.' : '.')
      );
    }
  }
  for (const [field, value] of Object.entries(entry)) {
    if (!allowed.includes(field)) continue;
    const fat = `${at}.${field}`;
    if (field === 'key') {
      if (typeof value !== 'string' || !KEY_PATTERN.test(value)) {
        errors.push(`${fat} ${JSON.stringify(value)} must match ^[a-z0-9]+(-[a-z0-9]+)*$ (lower-case words joined by single hyphens).`);
      } else if (value.length > TEXT_MAX) {
        errors.push(`${fat} is longer than ${TEXT_MAX} characters.`);
      }
      continue;
    }
    if (REQUIRED[kind].includes(field)) {
      if (value === null) continue; // reported above
      checkText(value, fat, NOTE_FIELDS.includes(field) ? NOTE_MAX : TEXT_MAX, errors);
      continue;
    }
    if (BOOLEAN_FIELDS.includes(field)) {
      if (typeof value !== 'boolean') {
        errors.push(
          value === null
            ? `${fat} cannot be null; omit it to preserve the destination value.`
            : `${fat} must be true or false.`
        );
      }
      continue;
    }
    if (field === 'sortOrder') {
      if (!Number.isInteger(value)) errors.push(`${fat} must be a whole number.`);
      continue;
    }
    if (field === 'verificationIntervalDays') {
      if (value === null) continue;
      if (!Number.isInteger(value) || value < 1) {
        errors.push(`${fat} ${JSON.stringify(value)} must be a positive whole number of days, or null for no interval. Zero and fractions are refused, never corrected.`);
      }
      continue;
    }
    if (ENUMS[field]) {
      if (value === null) continue;
      if (!ENUMS[field].includes(value)) {
        errors.push(`${fat} ${JSON.stringify(value)} is not one of ${ENUMS[field].join(', ')}. No fallback choice is made.`);
      }
      continue;
    }
    // Remaining fields are nullable text.
    if (value === null) continue;
    checkText(value, fat, NOTE_FIELDS.includes(field) ? NOTE_MAX : TEXT_MAX, errors);
  }
}

/* ------------------------------------------------------------------ *
 * Reporting helpers
 * ------------------------------------------------------------------ */

const lines = [];
const say = (s = '') => lines.push(s);
const mark = (state, text) => say(`  ${state.padEnd(5)} ${text}`);
const detail = (text) => say(`        ${text}`);
const flush = () => process.stdout.write(lines.join('\n') + '\n');

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

const [filePath, exportPath] = process.argv.slice(2);
if (!filePath) {
  process.stderr.write(
    '\n  usage: node scripts/check-ra-vocabularies.mjs <file.vocabularies.json> [<ra-vocabularies.json export>]\n\n'
  );
  process.exit(2);
}

const file = readJson(filePath, 'vocabulary file');
const destination = exportPath ? readJson(exportPath, 'export') : undefined;

say();
say(
  `Vocabulary pre-flight -- ${basename(filePath)}` +
    (exportPath ? ` against ${basename(exportPath)}` : ' (no export given: structure only)')
);
say();

/* ---- Envelope ---- */

const envelope = envelopeErrors(file, 'file');
// Some envelope faults make the rows unreadable; the rest are reported beside the row
// problems so the author sees everything in one run rather than one fault per run.
const unreadable =
  !isRecord(file) ||
  looksLikeManifest(file) ||
  !isRecord(file.vocabularies) ||
  Object.values(file.vocabularies).some((e) => !isRecord(e) || !Array.isArray(e.entries));
if (unreadable) {
  mark('FAIL', `${envelope.length} problem(s) with the file envelope -- the importer refuses the whole file`);
  for (const e of envelope) detail(e);
  say();
  flush();
  process.exit(1);
}

/* ---- Rows ---- */

const errors = [...envelope];
const warnings = [];
let total = 0;
const present = Object.keys(file.vocabularies).filter((k) => WRITABLE.includes(k) || EXPORT_ONLY.includes(k));

for (const kind of present) {
  const entries = file.vocabularies[kind].entries;
  total += entries.length;
  if (!WRITABLE.includes(kind)) continue;
  const seen = new Map();
  const names = new Map();
  entries.forEach((entry, i) => {
    const at = `${kind}[${i}]`;
    entryErrors(kind, entry, at, errors);
    if (!isRecord(entry) || typeof entry.key !== 'string') return;
    if (seen.has(entry.key)) {
      errors.push(`${at}.key ${q(entry.key)} is also used by ${kind}[${seen.get(entry.key)}]. One key, one row.`);
    } else {
      seen.set(entry.key, i);
    }
    if (typeof entry.name === 'string' && entry.name.trim() !== '') {
      const n = normalise(entry.name);
      if (names.has(n)) {
        warnings.push(`${at} ${q(entry.name)} has the same name as ${kind}[${names.get(n)}] under another key -- two entries, one meaning`);
      } else {
        names.set(n, i);
      }
    }
  });
}

if (total > MAX_ENTRIES) {
  errors.push(`The file carries ${total} entries across all sections; the importer refuses more than ${MAX_ENTRIES}.`);
}

const writableCount = present.filter((k) => WRITABLE.includes(k)).reduce((n, k) => n + file.vocabularies[k].entries.length, 0);
if (writableCount === 0) {
  warnings.push('no riskSources, barrierLibrary or complianceObligations rows -- the import will have nothing to do');
}

for (const kind of present.filter((k) => EXPORT_ONLY.includes(k))) {
  const n = file.vocabularies[kind].entries.length;
  warnings.push(`${kind} (${n} row${n === 1 ? '' : 's'}) is export-only context -- the preview marks it "Not imported" and nothing in it is written`);
}

if (errors.length > 0) {
  mark('FAIL', `${errors.length} structural problem(s) -- the importer validates every row before any write`);
  for (const e of errors) detail(e);
} else {
  mark(
    'ok',
    `structure: ${present
      .filter((k) => WRITABLE.includes(k))
      .map((k) => `${file.vocabularies[k].entries.length} ${k}`)
      .join(', ') || 'no writable sections'}; keys valid and unique; enums and lengths within bounds`
  );
}

/* ---- Against the destination ---- */

const plan = { create: 0, update: 0, noop: 0 };
const detailLater = [];
const destErrors = [];

if (destination !== undefined && errors.length === 0) {
  const destProblems = envelopeErrors(destination, 'export');
  if (destProblems.length > 0) {
    mark('FAIL', 'the export is not usable as a destination baseline');
    for (const p of destProblems) detail(p);
    destErrors.push(...destProblems);
  } else {
    const sections = Object.keys(destination.vocabularies);
    mark(
      'ok',
      `export: ${sections
        .map((k) => {
          const env = destination.vocabularies[k];
          const inactive = env.entries.filter((e) => e.active === false).length;
          return `${env.entries.length} ${k}${env.source === 'seed' ? ' (seed)' : ''}${inactive ? ` (${inactive} inactive)` : ''}`;
        })
        .join(', ')}`
    );

    for (const kind of present.filter((k) => WRITABLE.includes(k))) {
      const env = destination.vocabularies[kind];
      if (env === undefined) {
        warnings.push(`the export has no ${kind} section, so the preview cannot be predicted for it -- was it a complete export?`);
        continue;
      }
      if (env.source === 'seed' && kind !== 'complianceObligations') {
        destErrors.push(
          `${kind} on the destination is still the package seed (source: "seed"). The import refuses to write it until an administrator has run the population step in Configuration > Vocabularies. Do that first, export again, and re-check.`
        );
      }
      const byKey = new Map();
      for (const row of env.entries) {
        if (!byKey.has(row.key)) byKey.set(row.key, []);
        byKey.get(row.key).push(row);
      }
      const byName = env.entries.map((row) => ({ row, n: normalise(row.name) }));

      file.vocabularies[kind].entries.forEach((entry, i) => {
        const at = `${kind}[${i}] ${q(entry.key)}`;
        const matches = byKey.get(entry.key) ?? [];
        if (matches.length > 1) {
          destErrors.push(`${at}: the destination holds ${matches.length} rows with this key -- a blocking conflict the import cannot resolve; fix the destination first.`);
          return;
        }
        if (matches.length === 0) {
          plan.create += 1;
          const n = normalise(entry.name);
          const same = byName.find((d) => d.n === n);
          if (same) {
            warnings.push(
              `${at} creates a new entry named ${q(entry.name)}, but the destination already has that name under key ${q(same.row.key)}${same.row.active === false ? ' (inactive)' : ''} -- the preview leaves it unselected; reuse the key or choose a different meaning`
            );
          } else {
            let best;
            for (const d of byName) {
              const s = similarity(entry.name, d.row.name);
              if (best === undefined || s > best.s) best = { s, row: d.row };
            }
            if (best && best.s >= 0.8) {
              warnings.push(`${at} ${q(entry.name)} resembles existing ${q(best.row.name)} (${best.row.key}, ${best.s.toFixed(2)}) -- confirm it is a different meaning, not a respelling`);
            }
          }
          if (entry.active === false) {
            warnings.push(`${at} is a new row created inactive -- nobody will be able to pick it`);
          }
          return;
        }
        const existing = matches[0];
        const diffs = [];
        for (const [field, value] of Object.entries(entry)) {
          if (field === 'key' || field === 'sortOrder') continue;
          const current = existing[field];
          const cleared = value === null && current !== undefined;
          const changed = value !== null && value !== current;
          if (cleared) diffs.push(`${field}: ${JSON.stringify(current)} -> cleared`);
          else if (changed) diffs.push(`${field}: ${JSON.stringify(current)} -> ${JSON.stringify(value)}`);
        }
        if (entry.sortOrder !== undefined && entry.sortOrder !== existing.sortOrder) {
          warnings.push(`${at} carries sortOrder ${entry.sortOrder}; the destination has ${existing.sortOrder ?? 'none'} and the import does not reorder -- the difference is shown as not applied`);
        }
        if (diffs.length === 0) {
          plan.noop += 1;
          return;
        }
        plan.update += 1;
        if (entry.name !== existing.name) {
          warnings.push(`${at} renames ${q(existing.name)} to ${q(entry.name)} -- the key stays; make sure a rename is intended and not a second entry`);
        }
        if (entry.active === false && existing.active !== false) {
          warnings.push(`${at} deactivates ${q(existing.name)} -- risks already carrying it keep it, new ones cannot pick it`);
        }
        if (entry.active === true && existing.active === false) {
          warnings.push(`${at} reactivates ${q(existing.name)}`);
        }
        detailLater.push(`${at} update: ${diffs.join('; ')}`);
      });
    }
  }
}

/* ---- Verdict ---- */

if (destErrors.length > 0) {
  mark('FAIL', `${destErrors.length} problem(s) against the destination`);
  for (const e of destErrors) detail(e);
} else if (destination !== undefined && errors.length === 0) {
  mark(
    'ok',
    `preview: ${plan.create} create(s), ${plan.update} update(s), ${plan.noop} identical row(s) that need no write`
  );
  for (const d of detailLater) detail(d);
  if (plan.update > 0) {
    detail('note: updates are UNSELECTED in the preview until the administrator ticks them; creates are selected by default');
  }
}

if (warnings.length > 0) {
  say();
  mark('warn', `${warnings.length} advisory`);
  for (const w of warnings) detail(w);
}

say();
if (errors.length > 0 || destErrors.length > 0) {
  mark('FAIL', 'not import-ready');
  flush();
  process.exit(1);
}
mark(
  'ok',
  destination === undefined
    ? 'import-ready structurally. Re-run with the tenant export to predict the preview.'
    : 'import-ready. Choose the file under Import vocabularies, review the preview, tick the updates you intend, then Apply.'
);
say();
flush();
