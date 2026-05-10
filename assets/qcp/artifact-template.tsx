// assets/qcp/artifact-template.tsx
//
// Live preview of a QCP under construction. Claude renders this artifact
// after each structural change during a /bo:qcp session.
//
// CONSTRAINTS:
// - Must be a single self-contained TSX file (Claude artifacts have no
//   node_modules access).
// - Tailwind utility classes only (no CSS imports).
// - Types embedded inline (mirror of bo-qcp-admin/src/utils/qcp-schema/types.ts
//   v1.0, but resolved/_unresolved fields stripped — this artifact previews
//   what's being authored, not what's being imported).
// - When Claude renders this, it replaces `INITIAL_QCP` with the current
//   in-progress state.

import React, { useState } from 'react';

// ----- Types (mirror schema v1.0; authoring shape, no _unresolved) -----

type QcpV1 = {
  title: string;
  description?: string;
  version: { major: number; minor: number };
  binding: { list_name: string; column_name: string; column_value: string };
  phases: PhaseV1[];
};

type PhaseV1 = {
  title: string;
  sort_order: number;
  process_details: ProcessDetailV1[];
};

type ProcessDetailV1 = {
  title: string;
  description: string;
  sort_order: number;
  na: boolean;
  comment_mandatory: boolean;
  links: LinkV1[];
  work_files: WorkFileV1[];
  triggers: TriggerV1[];
  trigger_forms: TriggerFormV1[];
  dependencies: DependencyV1[];
  highlight: HighlightV1;
};

type LinkV1 =
  | { type: 'external'; label: string; url: string }
  | { type: 'governing_document'; label: string; doc_name: string };

type WorkFileV1 = { doc_name: string; label: string };

type TriggerV1 =
  | { action_status: 'Started' | 'Completed' | 'Deviation';
      field_type: 'Choice'; list_name: string; field_name: string; value: string }
  | { action_status: 'Started' | 'Completed' | 'Deviation';
      field_type: 'DateTime'; list_name: string; field_name: string; days_offset: number };

type TriggerFormV1 = { hub: string; list_name: string; form_name: string };
type DependencyV1 = { phase_title: string; detail_title: string };
type HighlightV1 = {
  add_to_timeline: boolean;
  send_notification: { email: string; display_name?: string } | null;
};

// ----- INITIAL_QCP: replaced by Claude with the in-progress state -----

const INITIAL_QCP: QcpV1 = {
  title: 'Eksempel: Utviklingsprosjekt',
  description: 'Erstatt med faktisk QCP når samtalen produserer struktur.',
  version: { major: 0, minor: 0 },
  binding: { list_name: 'ProjectGeneral', column_name: 'ProjectType', column_value: 'Utvikling' },
  phases: [
    {
      title: 'Initiering',
      sort_order: 1,
      process_details: [
        {
          title: 'Forretningscase godkjent',
          description: 'Kost-nytte godkjent av styringsgruppe.',
          sort_order: 1,
          na: false,
          comment_mandatory: true,
          links: [],
          work_files: [],
          triggers: [],
          trigger_forms: [],
          dependencies: [],
          highlight: { add_to_timeline: true, send_notification: null }
        }
      ]
    }
  ]
};

// ----- Component -----

export default function QcpPreview() {
  const qcp = INITIAL_QCP;
  const totalSteps = qcp.phases.reduce((n, p) => n + p.process_details.length, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white text-slate-900 font-sans">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">{qcp.title}</h1>
        {qcp.description && (
          <p className="text-slate-600 text-sm">{qcp.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="bg-slate-100 px-2 py-1 rounded">
            v{qcp.version.major}.{qcp.version.minor}
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {qcp.binding.list_name} · {qcp.binding.column_name} = {qcp.binding.column_value}
          </span>
          <span className="bg-slate-100 px-2 py-1 rounded">
            {qcp.phases.length} faser · {totalSteps} sjekkpunkter
          </span>
        </div>
      </header>

      <ol className="space-y-4">
        {qcp.phases
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((phase, i) => (
            <Phase key={i} phase={phase} index={i} />
          ))}
      </ol>
    </div>
  );
}

function Phase({ phase, index }: { phase: PhaseV1; index: number }) {
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
          <span className="font-medium">{phase.title}</span>
          <span className="text-xs text-slate-500">
            {phase.process_details.length} sjekkpunkter
          </span>
        </div>
        <span className="text-slate-400 text-lg">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <ol className="divide-y divide-slate-100">
          {phase.process_details
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((detail, j) => (
              <Detail key={j} detail={detail} />
            ))}
        </ol>
      )}
    </li>
  );
}

function Detail({ detail }: { detail: ProcessDetailV1 }) {
  return (
    <li className="px-5 py-3">
      <div className="flex items-start gap-2 mb-1">
        <h4 className="font-medium text-slate-900">{detail.title}</h4>
        {detail.na && (
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            Kan settes N/A
          </span>
        )}
        {detail.comment_mandatory && (
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
            Kommentar påkrevet
          </span>
        )}
      </div>
      {detail.description && (
        <p className="text-sm text-slate-600 mb-2">{detail.description}</p>
      )}
      <Badges detail={detail} />
    </li>
  );
}

function Badges({ detail }: { detail: ProcessDetailV1 }) {
  const items: { label: string; tone: string }[] = [];

  if (detail.links.length > 0) {
    items.push({ label: `${detail.links.length} link${detail.links.length > 1 ? 'er' : ''}`, tone: 'bg-blue-50 text-blue-700' });
  }
  if (detail.work_files.length > 0) {
    items.push({ label: `${detail.work_files.length} arbeidsfil${detail.work_files.length > 1 ? 'er' : ''}`, tone: 'bg-indigo-50 text-indigo-700' });
  }
  if (detail.triggers.length > 0) {
    items.push({ label: `${detail.triggers.length} trigger${detail.triggers.length > 1 ? 'e' : ''}`, tone: 'bg-emerald-50 text-emerald-700' });
  }
  if (detail.trigger_forms.length > 0) {
    items.push({ label: `${detail.trigger_forms.length} trigger-skjema${detail.trigger_forms.length > 1 ? 'er' : ''}`, tone: 'bg-emerald-50 text-emerald-700' });
  }
  if (detail.dependencies.length > 0) {
    items.push({ label: `Avhengig av ${detail.dependencies.length} steg`, tone: 'bg-purple-50 text-purple-700' });
  }
  if (detail.highlight.add_to_timeline) {
    items.push({ label: 'Tidslinje', tone: 'bg-rose-50 text-rose-700' });
  }
  if (detail.highlight.send_notification) {
    items.push({ label: `Varsler ${detail.highlight.send_notification.email}`, tone: 'bg-rose-50 text-rose-700' });
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {items.map((item, i) => (
        <span key={i} className={`text-xs px-2 py-0.5 rounded ${item.tone}`}>
          {item.label}
        </span>
      ))}
    </div>
  );
}
