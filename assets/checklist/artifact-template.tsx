// assets/checklist/artifact-template.tsx
//
// Live preview of a checklist template under construction. Claude renders
// this artifact after each structural change during a /bo:checklist session.
//
// CONSTRAINTS:
// - Must be a single self-contained TSX file (Claude artifacts have no
//   node_modules access).
// - Tailwind utility classes only (no CSS imports).
// - Types embedded inline (mirror of checklist-schema-v1.json).
// - When Claude renders this, it replaces `INITIAL_CHECKLIST` with the
//   current in-progress state, and the four import-metadata fields
//   (name / code / category / project types) with the working values.

import React, { useState } from 'react';

// ----- Types (mirror checklist-schema-v1.json) -----

type FieldType =
  | 'date'
  | 'singletext'
  | 'multiline'
  | 'choice'
  | 'multichoice'
  | 'number'
  | 'yesno'
  | 'attachment'
  | 'peoplepicker';

type Link = { url?: string; description: string; fileUrl?: string };

type Field = {
  id: string;
  name: string;
  displayName: string;
  section: string;
  type: FieldType;
  required: boolean;
  order: number;
  placeholder?: string;
  defaultValue?: string;
  allowAttachment?: boolean;
  replicate?: boolean;
  values?: string[];
  rows?: number;
  min?: number;
  max?: number;
  links?: Link[];
};

type Checklist = { fields: Field[] };

// Import-time metadata — NOT part of the .checklist.json file, entered in
// Template Manager. Shown here only so the user can sanity-check it.
const META = {
  name: 'Eksempel: Vernerunde HMS',
  code: 'CL-VR-001',
  category: '(velg kategori i Template Manager)',
  projectTypes: ['(velg gjeldende prosjekttyper)'],
};

// ----- INITIAL_CHECKLIST: replaced by Claude with the in-progress state -----

const INITIAL_CHECKLIST: Checklist = {
  fields: [
    {
      id: 'Q1',
      name: 'dato_for_vernerunde',
      displayName: 'Dato for vernerunde',
      section: 'Generell informasjon',
      type: 'date',
      required: true,
      order: 1,
      placeholder: 'Velg dato vernerunden gjennomføres',
    },
    {
      id: 'Q2',
      name: 'avdeling_/_lokasjon',
      displayName: 'Avdeling / lokasjon',
      section: 'Generell informasjon',
      type: 'choice',
      required: true,
      order: 2,
      values: ['Moseidveien 35', 'Strankaien 34', 'Nucleus Mall'],
      replicate: true,
    },
  ],
};

const TYPE_LABEL: Record<FieldType, string> = {
  date: 'Dato',
  singletext: 'Tekst',
  multiline: 'Tekst (flere linjer)',
  choice: 'Enkeltvalg',
  multichoice: 'Flervalg',
  number: 'Tall',
  yesno: 'Ja/Nei',
  attachment: 'Vedlegg',
  peoplepicker: 'Personvelger',
};

const TYPE_TONE: Record<FieldType, string> = {
  date: 'bg-sky-100 text-sky-800',
  singletext: 'bg-slate-100 text-slate-700',
  multiline: 'bg-slate-100 text-slate-700',
  choice: 'bg-violet-100 text-violet-800',
  multichoice: 'bg-violet-100 text-violet-800',
  number: 'bg-cyan-100 text-cyan-800',
  yesno: 'bg-emerald-100 text-emerald-800',
  attachment: 'bg-indigo-100 text-indigo-800',
  peoplepicker: 'bg-amber-100 text-amber-800',
};

// ----- Component -----

export default function ChecklistPreview() {
  const checklist = INITIAL_CHECKLIST;
  const fields = checklist.fields.slice().sort((a, b) => a.order - b.order);

  // Group consecutive fields by section, preserving order.
  const sections: { name: string; fields: Field[] }[] = [];
  for (const f of fields) {
    const last = sections[sections.length - 1];
    if (last && last.name === f.section) last.fields.push(f);
    else sections.push({ name: f.section, fields: [f] });
  }

  const requiredCount = fields.filter((f) => f.required).length;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white text-slate-900 font-sans">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">{META.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="bg-slate-100 px-2 py-1 rounded">Kode: {META.code}</span>
          <span className="bg-slate-100 px-2 py-1 rounded">Kategori: {META.category}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Prosjekttyper: {META.projectTypes.join(', ')}
          </span>
          <span className="bg-slate-100 px-2 py-1 rounded">
            {sections.length} seksjoner · {fields.length} felt · {requiredCount} påkrevet
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Navn, kode, kategori og prosjekttyper settes i Template Manager ved import — de er
          ikke del av .checklist.json-filen.
        </p>
      </header>

      <ol className="space-y-4">
        {sections.map((section, i) => (
          <Section key={i} name={section.name} fields={section.fields} index={i} />
        ))}
      </ol>
    </div>
  );
}

function Section({ name, fields, index }: { name: string; fields: Field[]; index: number }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <li className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition"
      >
        <div className="flex items-center gap-3">
          <span className="bg-slate-700 text-white text-sm w-7 h-7 rounded-full flex items-center justify-center font-medium">
            {index + 1}
          </span>
          <span className="font-medium">{name}</span>
          <span className="text-xs text-slate-500">{fields.length} felt</span>
        </div>
        <span className="text-slate-400 text-lg">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <ol className="divide-y divide-slate-100">
          {fields.map((field, j) => (
            <FieldRow key={j} field={field} />
          ))}
        </ol>
      )}
    </li>
  );
}

function FieldRow({ field }: { field: Field }) {
  return (
    <li className="px-5 py-3">
      <div className="flex items-start gap-2 mb-1 flex-wrap">
        <span className="text-xs text-slate-400 font-mono mt-0.5">{field.id}</span>
        <h4 className="font-medium text-slate-900">
          {field.displayName}
          {field.required && <span className="text-rose-500 ml-0.5">*</span>}
        </h4>
        <span className={`text-xs px-2 py-0.5 rounded ${TYPE_TONE[field.type]}`}>
          {TYPE_LABEL[field.type]}
        </span>
      </div>

      {field.placeholder && (
        <p className="text-sm text-slate-500 italic mb-2">{field.placeholder}</p>
      )}

      {(field.type === 'choice' || field.type === 'multichoice') && field.values && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {field.values.map((v, i) => (
            <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
              {v}
            </span>
          ))}
        </div>
      )}

      <Badges field={field} />
    </li>
  );
}

function Badges({ field }: { field: Field }) {
  const items: { label: string; tone: string }[] = [];

  if (field.type === 'number' && (field.min !== undefined || field.max !== undefined)) {
    items.push({
      label: `Område ${field.min ?? '–'}…${field.max ?? '–'}`,
      tone: 'bg-cyan-50 text-cyan-700',
    });
  }
  if (field.type === 'multiline' && field.rows) {
    items.push({ label: `${field.rows} linjer`, tone: 'bg-slate-50 text-slate-600' });
  }
  if (field.defaultValue) {
    items.push({ label: `Standard: ${field.defaultValue}`, tone: 'bg-slate-50 text-slate-600' });
  }
  if (field.allowAttachment) {
    items.push({ label: 'Tillat vedlegg', tone: 'bg-indigo-50 text-indigo-700' });
  }
  if (field.replicate) {
    items.push({ label: 'Kan repeteres', tone: 'bg-purple-50 text-purple-700' });
  }
  if (field.links && field.links.length > 0) {
    const gov = field.links.filter((l) => l.fileUrl).length;
    const ext = field.links.length - gov;
    if (ext > 0) items.push({ label: `${ext} ekstern lenke`, tone: 'bg-blue-50 text-blue-700' });
    if (gov > 0)
      items.push({ label: `${gov} styrende dok.`, tone: 'bg-blue-50 text-blue-700' });
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {items.map((item, i) => (
        <span key={i} className={`text-xs px-2 py-0.5 rounded ${item.tone}`}>
          {item.label}
        </span>
      ))}
    </div>
  );
}
