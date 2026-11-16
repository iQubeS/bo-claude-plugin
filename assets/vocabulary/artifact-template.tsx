// assets/vocabulary/artifact-template.tsx
//
// Live preview of a vocabulary-maintenance file under construction. Claude renders this
// artifact after each change to the proposed entries during a /bo:vocabulary session,
// so the user sees the same thing the BO import preview will show: per list, which rows
// are new, which update an existing entry and what each update changes.
//
// CONSTRAINTS:
// - Single self-contained TSX file (Claude artifacts have no node_modules access).
// - Tailwind utility classes only (no CSS imports).
// - Types embedded inline (mirror of ra-vocabularies.schema-v1.json, writable kinds).
// - When Claude renders this, it replaces `PROPOSED` with the in-progress file and
//   `DESTINATION` with the three writable sections of the tenant export.
//
// WHAT THIS PREVIEW DELIBERATELY DOES NOT DO
// ------------------------------------------
// It never merges by name. A row matches a destination entry by key or not at all, which
// is exactly how the import behaves. A new row whose name already exists under another
// key is flagged, not resolved.

import React, { useMemo, useState } from 'react';

// ----- Types (writable kinds of ra-vocabularies.schema-v1.json) -----

type Entry = {
  key: string;
  name: string;
  nameNb?: string | null;
  active?: boolean;
  sortOrder?: number;
  description?: string;
  suggestedType?: string | null;
  suggestedFunction?: string | null;
  performanceRequirement?: string | null;
  verificationIntervalDays?: number | null;
  documentReference?: string | null;
  obligationType?: string | null;
  reference?: string | null;
  jurisdiction?: string | null;
};

type Kind = 'riskSources' | 'barrierLibrary' | 'complianceObligations';
type Section = { source?: 'stored' | 'seed'; entries: Entry[] };
type File = { format: 'bo-ra-vocabularies'; version: 1; vocabularies: Partial<Record<Kind, Section>> };

// ----- Replaced by Claude at render time -----

const PROPOSED: File = {
  format: 'bo-ra-vocabularies',
  version: 1,
  vocabularies: {
    riskSources: {
      source: 'stored',
      entries: [
        { key: 'vibration', name: 'Hand-arm and whole-body vibration', nameNb: 'Vibrasjon' },
        { key: 'hot-work', name: 'Hot work', nameNb: 'Varmt arbeid' },
      ],
    },
    barrierLibrary: {
      source: 'stored',
      entries: [
        {
          key: 'safe-job-analysis',
          name: 'Safe job analysis before start-up',
          nameNb: 'Sikker jobb-analyse før oppstart',
          description:
            'A safe job analysis is held with the crew before a non-routine operation starts, and the controls it names are in place before the first step.',
          suggestedType: 'Organisational',
          suggestedFunction: 'Preventing',
        },
      ],
    },
  },
};

const DESTINATION: Partial<Record<Kind, Section>> = {
  riskSources: {
    source: 'stored',
    entries: [{ key: 'hot-work', name: 'Hot work', active: true, sortOrder: 400 }],
  },
  barrierLibrary: { source: 'stored', entries: [] },
  complianceObligations: { source: 'stored', entries: [] },
};

// ----- Diff -----

const KINDS: { kind: Kind; label: string }[] = [
  { kind: 'riskSources', label: 'Farekilder' },
  { kind: 'barrierLibrary', label: 'Barrierebibliotek' },
  { kind: 'complianceObligations', label: 'Samsvarsforpliktelser' },
];

const normalise = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

type Row = {
  entry: Entry;
  op: 'create' | 'update' | 'unchanged';
  changes: string[];
  nameClash?: string;
  reactivates?: boolean;
  deactivates?: boolean;
};

function diffKind(kind: Kind): Row[] {
  const proposed = PROPOSED.vocabularies[kind]?.entries ?? [];
  const dest = DESTINATION[kind]?.entries ?? [];
  const byKey = new Map(dest.map((e) => [e.key, e]));
  return proposed.map((entry) => {
    const existing = byKey.get(entry.key);
    if (!existing) {
      const clash = dest.find((d) => normalise(d.name) === normalise(entry.name));
      return { entry, op: 'create', changes: [], nameClash: clash?.key };
    }
    const changes: string[] = [];
    for (const [field, value] of Object.entries(entry)) {
      if (field === 'key' || field === 'sortOrder') continue;
      const current = (existing as Record<string, unknown>)[field];
      if (value === null && current !== undefined) changes.push(`${field}: ${JSON.stringify(current)} → (cleared)`);
      else if (value !== null && value !== current) changes.push(`${field}: ${JSON.stringify(current ?? '')} → ${JSON.stringify(value)}`);
    }
    return {
      entry,
      op: changes.length === 0 ? 'unchanged' : 'update',
      changes,
      reactivates: entry.active === true && existing.active === false,
      deactivates: entry.active === false && existing.active !== false,
    };
  });
}

// ----- UI -----

const Badge: React.FC<{ tone: 'new' | 'upd' | 'same' | 'warn'; children: React.ReactNode }> = ({ tone, children }) => {
  const cls =
    tone === 'new'
      ? 'bg-sky-100 text-sky-900'
      : tone === 'upd'
        ? 'bg-amber-100 text-amber-900'
        : tone === 'warn'
          ? 'bg-rose-100 text-rose-900'
          : 'bg-slate-100 text-slate-700';
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
};

export default function VocabularyPreview() {
  const [kind, setKind] = useState<Kind>('riskSources');
  const rows = useMemo(() => diffKind(kind), [kind]);
  const totals = useMemo(
    () =>
      KINDS.map(({ kind: k, label }) => {
        const r = diffKind(k);
        return {
          k,
          label,
          create: r.filter((x) => x.op === 'create').length,
          update: r.filter((x) => x.op === 'update').length,
          same: r.filter((x) => x.op === 'unchanged').length,
          seed: DESTINATION[k]?.source === 'seed',
        };
      }),
    []
  );

  return (
    <div className="mx-auto max-w-5xl p-4 font-sans text-sm text-slate-800">
      <h1 className="mb-1 text-lg font-semibold">Ordlister til import</h1>
      <p className="mb-4 text-slate-600">
        Slik vil forhåndsvisningen i BO lese filen. Nye rader er forhåndsvalgt; endringer må krysses av.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {totals.map((t) => (
          <button
            key={t.k}
            onClick={() => setKind(t.k)}
            className={`rounded border px-3 py-1.5 text-left ${kind === t.k ? 'border-slate-800 bg-white' : 'border-slate-300 bg-slate-50'}`}
          >
            <div className="font-medium">{t.label}</div>
            <div className="text-xs text-slate-600">
              {t.create} nye · {t.update} endret · {t.same} uendret
              {t.seed && <span className="ml-1 text-rose-700">· seed, ikke skrivbar ennå</span>}
            </div>
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-500">Ingen rader i denne listen.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-300 text-left text-xs uppercase text-slate-500">
              <th className="py-1 pr-3">Nøkkel</th>
              <th className="py-1 pr-3">Navn</th>
              <th className="py-1 pr-3">Norsk</th>
              <th className="py-1 pr-3">Operasjon</th>
              <th className="py-1">Detaljer</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.entry.key} className="border-b border-slate-100 align-top">
                <td className="py-2 pr-3 font-mono text-xs">{r.entry.key}</td>
                <td className="py-2 pr-3">{r.entry.name}</td>
                <td className="py-2 pr-3 text-slate-600">{r.entry.nameNb ?? ''}</td>
                <td className="py-2 pr-3">
                  {r.op === 'create' && <Badge tone="new">ny</Badge>}
                  {r.op === 'update' && <Badge tone="upd">endring</Badge>}
                  {r.op === 'unchanged' && <Badge tone="same">uendret</Badge>}
                  {r.nameClash && (
                    <div className="mt-1">
                      <Badge tone="warn">navn finnes under {r.nameClash}</Badge>
                    </div>
                  )}
                  {r.reactivates && (
                    <div className="mt-1">
                      <Badge tone="warn">reaktiverer</Badge>
                    </div>
                  )}
                  {r.deactivates && (
                    <div className="mt-1">
                      <Badge tone="warn">deaktiverer</Badge>
                    </div>
                  )}
                </td>
                <td className="py-2 text-xs text-slate-600">
                  {r.op === 'create' && kind === 'barrierLibrary' && (
                    <div>
                      <div className="italic">{r.entry.description}</div>
                      <div className="mt-1">
                        {r.entry.suggestedType ?? '—'} · {r.entry.suggestedFunction ?? '—'}
                        {r.entry.verificationIntervalDays ? ` · ${r.entry.verificationIntervalDays} dager` : ''}
                        {r.entry.documentReference ? ` · ${r.entry.documentReference}` : ''}
                      </div>
                    </div>
                  )}
                  {r.op === 'create' && kind === 'complianceObligations' && (
                    <div>
                      {r.entry.obligationType ?? '—'} · {r.entry.reference ?? 'referanse mangler'} · {r.entry.jurisdiction ?? '—'}
                    </div>
                  )}
                  {r.op === 'update' && (
                    <ul className="list-disc pl-4">
                      {r.changes.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Filen sletter aldri, endrer aldri en nøkkel, og rører ikke eksponeringsmål, frekvensnivåer,
        ekskluderingsgrunner eller vesentlighetskriterier.
      </p>
    </div>
  );
}
