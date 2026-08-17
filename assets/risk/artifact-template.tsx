// assets/risk/artifact-template.tsx
//
// Live preview of a risk assessment template under construction. Claude renders this
// artifact after each structural change during a /bo:risk session.
//
// CONSTRAINTS:
// - Single self-contained TSX file (Claude artifacts have no node_modules access).
// - Tailwind utility classes only (no CSS imports).
// - Types embedded inline (mirror of ra-template-import.schema-v1.json).
// - When Claude renders this, it replaces `INITIAL_TEMPLATE` with the in-progress state
//   and `RESOLUTION` with the current vocabulary / left-behind counts.
//
// TWO THINGS THIS PREVIEW DELIBERATELY DOES NOT DO
// ------------------------------------------------
// 1. It never computes or shows a risk value (consequence x probability). The tool
//    derives banding itself, and a number here would be an invention.
// 2. It never uses red/amber/green. The destination format withholds the acceptance
//    limit on purpose, so an author scores the hazard rather than the screen — and a
//    green cell is an invitation to score the screen. Category chips use non-semantic
//    hues assigned by order of appearance, and severity is shown as a label plus its
//    position on the axis, in neutral grey.
//
// If a user asks for a traffic-light matrix, explain why it is absent rather than
// adding one.

import React, { useState } from 'react';

// ----- Types (mirror ra-template-import.schema-v1.json) -----

type Score = {
  effectCategory: string;
  consequence: string | number;
  probability: string | number;
};

type Risk = {
  event: string;
  cause?: string;
  consequence?: string;
  riskSource?: string;
  exposureTarget?: string;
  minimumPpe?: string;
  inherentScores?: Score[];
};

type Activity = {
  name: string;
  description?: string;
  effectCategories?: string[];
  risks?: Risk[];
};

type Template = {
  version: 1;
  template: { name: string; description?: string };
  activities: Activity[];
};

// Not part of the file. Display only, so the user can see how close the file is to
// importing without anyone having to reconcile it by hand.
type Resolution = {
  manifestName: string;
  matrixSize: number; // levels per axis on this tenant, for the position dots
  resolvedTerms: number;
  unresolvedTerms: { kind: string; value: string; uses: number }[];
  leftBehind: { label: string; count: number; note: string }[];
};

// ----- Replaced by Claude with the in-progress state -----

const INITIAL_TEMPLATE: Template = {
  version: 1,
  template: {
    name: 'Mekanisk montasje hos kunde',
    description:
      'Levering, montasje, idriftsettelse og overlevering av en skid-montert enhet på kundes anlegg. Dekker arbeid fra transporten ankommer til signert overtakelse. Dekker ikke grunnarbeid eller opplæring av operatører.',
  },
  activities: [
    {
      name: 'Transport og lossing',
      description: 'Mottak av enheten og lossing fra kjøretøy med mobilkran.',
      effectCategories: ['Health', 'Finance'],
      risks: [
        {
          event: 'Last forskyver seg eller faller under løft fra hengeren',
          cause: 'Surringer løsnet før kranen har tatt vekten.',
          consequence: 'Klemskade på personell ved siden av hengeren.',
          riskSource: 'Falling or shifting load',
          exposureTarget: 'Personnel',
          minimumPpe: 'Hjelm, synlighetstøy, vernesko, slaghansker',
          inherentScores: [
            { effectCategory: 'Health', consequence: 'Very critical', probability: 'Probable' },
            { effectCategory: 'Finance', consequence: 'Moderate', probability: 'Low probability' },
          ],
        },
      ],
    },
  ],
};

const RESOLUTION: Resolution = {
  manifestName: 'ra-vocabulary-manifest.json',
  matrixSize: 5,
  resolvedTerms: 4,
  unresolvedTerms: [],
  leftBehind: [],
};

// ----- Presentation -----

// Non-semantic hues, assigned by order of first appearance. These distinguish categories
// from one another; they say nothing about severity.
const CATEGORY_TONES = [
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'bg-slate-200 text-slate-800 border-slate-300',
];

function makeToneLookup(template: Template) {
  const order: string[] = [];
  for (const a of template.activities) {
    for (const c of a.effectCategories ?? []) if (!order.includes(c)) order.push(c);
    for (const r of a.risks ?? []) {
      for (const s of r.inherentScores ?? []) {
        if (!order.includes(s.effectCategory)) order.push(s.effectCategory);
      }
    }
  }
  return (name: string) => {
    const at = order.indexOf(name);
    return CATEGORY_TONES[(at < 0 ? 0 : at) % CATEGORY_TONES.length];
  };
}

/** A level may be a label or an ordinal. Show whichever was written, plus position if known. */
function levelParts(value: string | number): { text: string; ordinal?: number } {
  if (typeof value === 'number') return { text: String(value), ordinal: value };
  const asNumber = Number(value);
  if (value.trim() !== '' && !Number.isNaN(asNumber)) return { text: value, ordinal: asNumber };
  return { text: value };
}

export default function RiskTemplatePreview() {
  const doc = INITIAL_TEMPLATE;
  const toneFor = makeToneLookup(doc);

  const activities = doc.activities;
  const riskCount = activities.reduce((n, a) => n + (a.risks?.length ?? 0), 0);
  const scoreCount = activities.reduce(
    (n, a) => n + (a.risks ?? []).reduce((m, r) => m + (r.inherentScores?.length ?? 0), 0),
    0
  );
  const unscorable = activities.filter((a) => (a.effectCategories ?? []).length === 0).length;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white text-slate-900 font-sans">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">{doc.template.name}</h1>
        {doc.template.description && (
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {doc.template.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="bg-slate-100 px-2 py-1 rounded">
            {activities.length} aktiviteter · {riskCount} risikoer · {scoreCount} scorer
          </span>
          {unscorable > 0 && (
            <span className="bg-slate-200 text-slate-800 px-2 py-1 rounded">
              {unscorable} aktivitet(er) uten kategorier — ikke scorbare
            </span>
          )}
        </div>
      </header>

      <ResolutionPanel resolution={RESOLUTION} />

      <ol className="space-y-4 mt-6">
        {activities.map((activity, i) => (
          <ActivityCard key={i} activity={activity} index={i} toneFor={toneFor} />
        ))}
      </ol>

      <p className="mt-6 text-xs text-slate-400 leading-relaxed max-w-3xl">
        Forhåndsvisningen viser ingen risikoverdi og ingen fargekoder. Verktøyet regner ut
        banding selv, og akseptkriteriet holdes bevisst utenfor forfatterens synsfelt — den
        som ser hvor grensen går fristes til å score skjermbildet i stedet for faren.
      </p>
    </div>
  );
}

function ResolutionPanel({ resolution }: { resolution: Resolution }) {
  const { resolvedTerms, unresolvedTerms, leftBehind, manifestName } = resolution;
  const clean = unresolvedTerms.length === 0;

  return (
    <section className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Ordbokoppslag mot {manifestName}
        </span>
        <span className="text-xs font-medium text-slate-800">
          {clean
            ? `${resolvedTerms} begreper resolver — ingenting å avstemme`
            : `${unresolvedTerms.length} begrep(er) må avstemmes ved import`}
        </span>
      </div>

      {!clean && (
        <ul className="divide-y divide-slate-100">
          {unresolvedTerms.map((u, i) => (
            <li key={i} className="px-4 py-2 flex items-baseline gap-3 text-sm">
              <span className="text-xs font-mono text-slate-400 w-32 shrink-0">{u.kind}</span>
              <span className="font-medium">{u.value}</span>
              <span className="text-xs text-slate-500 ml-auto tabular-nums">{u.uses} bruk</span>
            </li>
          ))}
        </ul>
      )}

      {leftBehind.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 bg-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
            Følger ikke med i filen
          </p>
          <ul className="space-y-1">
            {leftBehind.map((l, i) => (
              <li key={i} className="text-sm flex items-baseline gap-2">
                <span className="text-xs tabular-nums text-slate-500 w-10 shrink-0">{l.count}</span>
                <span className="font-medium line-through decoration-slate-300">{l.label}</span>
                <span className="text-xs text-slate-500">— {l.note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function ActivityCard({
  activity,
  index,
  toneFor,
}: {
  activity: Activity;
  index: number;
  toneFor: (name: string) => string;
}) {
  const [expanded, setExpanded] = useState(true);
  const risks = activity.risks ?? [];
  const categories = activity.effectCategories ?? [];

  return (
    <li className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-start justify-between gap-3 bg-slate-50 hover:bg-slate-100 transition text-left"
      >
        <div className="flex items-start gap-3 min-w-0">
          <span className="bg-slate-700 text-white text-sm w-7 h-7 rounded-full flex items-center justify-center font-medium shrink-0 tabular-nums">
            {index + 1}
          </span>
          <div className="min-w-0">
            <div className="font-medium">{activity.name}</div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="text-xs text-slate-500">
                {risks.length} {risks.length === 1 ? 'risiko' : 'risikoer'}
              </span>
              {categories.length === 0 ? (
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  ingen kategorier — ikke scorbar
                </span>
              ) : (
                categories.map((c, i) => (
                  <span key={i} className={`text-xs px-2 py-0.5 rounded border ${toneFor(c)}`}>
                    {c}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
        <span className="text-slate-400 text-lg shrink-0">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <>
          {activity.description && (
            <p className="px-5 pt-3 text-sm text-slate-600">{activity.description}</p>
          )}
          {risks.length === 0 ? (
            <p className="px-5 py-3 text-sm text-slate-400 italic">
              Ingen risikoer ennå — aktiviteten importeres tom.
            </p>
          ) : (
            <ol className="divide-y divide-slate-100 mt-2">
              {risks.map((risk, j) => (
                <RiskRow
                  key={j}
                  risk={risk}
                  index={j}
                  listed={new Set(categories)}
                  toneFor={toneFor}
                />
              ))}
            </ol>
          )}
        </>
      )}
    </li>
  );
}

function RiskRow({
  risk,
  index,
  listed,
  toneFor,
}: {
  risk: Risk;
  index: number;
  listed: Set<string>;
  toneFor: (name: string) => string;
}) {
  const scores = risk.inherentScores ?? [];

  return (
    <li className="px-5 py-3">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xs text-slate-400 font-mono tabular-nums shrink-0">{index + 1}</span>
        <h4 className="font-medium text-slate-900">{risk.event}</h4>
      </div>

      <dl className="text-sm space-y-0.5 ml-6">
        {risk.cause && (
          <div className="flex gap-2">
            <dt className="text-slate-400 w-24 shrink-0">Årsak</dt>
            <dd className="text-slate-700">{risk.cause}</dd>
          </div>
        )}
        {risk.consequence && (
          <div className="flex gap-2">
            <dt className="text-slate-400 w-24 shrink-0">Konsekvens</dt>
            <dd className="text-slate-700">{risk.consequence}</dd>
          </div>
        )}
        {risk.minimumPpe && (
          <div className="flex gap-2">
            <dt className="text-slate-400 w-24 shrink-0">Verneutstyr</dt>
            <dd className="text-slate-700">{risk.minimumPpe}</dd>
          </div>
        )}
      </dl>

      <div className="flex flex-wrap gap-1.5 mt-2 ml-6">
        {risk.riskSource ? (
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
            Farekilde: {risk.riskSource}
          </span>
        ) : (
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded italic">
            Ingen farekilde — havner uten porteføljegruppering
          </span>
        )}
        {risk.exposureTarget && (
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
            Utsatt: {risk.exposureTarget}
          </span>
        )}
      </div>

      {scores.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 ml-6">
          {scores.map((s, i) => (
            <ScoreChip
              key={i}
              score={s}
              tone={toneFor(s.effectCategory)}
              orphaned={listed.size > 0 && !listed.has(s.effectCategory)}
            />
          ))}
        </div>
      )}
    </li>
  );
}

function ScoreChip({
  score,
  tone,
  orphaned,
}: {
  score: Score;
  tone: string;
  orphaned: boolean;
}) {
  const c = levelParts(score.consequence);
  const p = levelParts(score.probability);

  return (
    <div
      className={`text-xs border rounded px-2 py-1 ${tone} ${
        orphaned ? 'ring-1 ring-slate-400 ring-offset-1' : ''
      }`}
      title={
        orphaned
          ? 'Aktiviteten lister ikke denne kategorien — scoren havner der ingen kolonne viser den'
          : undefined
      }
    >
      <div className="font-medium">{score.effectCategory}</div>
      <div className="mt-0.5 flex items-center gap-2">
        <span>K: {c.text}</span>
        <span className="opacity-50">·</span>
        <span>S: {p.text}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <AxisDots ordinal={c.ordinal} />
        <AxisDots ordinal={p.ordinal} />
      </div>
      {orphaned && <div className="mt-1 italic">ikke listet på aktiviteten</div>}
    </div>
  );
}

/**
 * Position on the axis, in neutral grey. This states where a level sits on its own
 * ladder — not whether that is acceptable. Nothing here is colour-coded, for the reason
 * in the header comment.
 */
function AxisDots({ ordinal }: { ordinal?: number }) {
  if (ordinal === undefined) return null;
  const size = RESOLUTION.matrixSize;
  return (
    <span className="inline-flex gap-0.5" aria-label={`Nivå ${ordinal} av ${size}`}>
      {Array.from({ length: size }, (_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i < ordinal ? 'bg-slate-500' : 'bg-slate-300'}`}
        />
      ))}
    </span>
  );
}
