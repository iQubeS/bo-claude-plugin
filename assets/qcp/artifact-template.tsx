// assets/qcp/artifact-template.tsx
//
// Live preview of a QCP under construction. Claude renders this artifact
// after each structural change during a /bo:qcp session.
//
// CONSTRAINTS:
// - Must be a single self-contained TSX file (Claude artifacts have no
//   node_modules access).
// - Tailwind utility classes only (no CSS imports).
// - Types embedded inline. They mirror the stored QCP body (<Title>.txt) as
//   QCPAdmin writes and reads it: bo-qcp-admin/src/webparts/qcpAdmin/components/
//   Modal/{QCPModal,ProcessPhase,ProcessDetail}.ts at v0.2.0, vendored under
//   assets/qcp/upstream/. Runtime-only fields (status, comments, modifiedBy,
//   percentage, statusInformations timestamps) are omitted from the preview
//   types; the output file carries them empty.
// - When Claude renders this, it replaces `INITIAL_QCP` with the current
//   in-progress state (the same object that becomes the .txt; extra keys are
//   ignored by the preview).

import React, { useState } from 'react';

// ----- Types (stored .txt shape; preview subset) -----

type Qcp = {
  qcpTitle: string;
  processPhases: Phase[];
  /** Not in the file. Shown in the header so the binding is reviewed with the QCP. */
  binding?: { list: string; column: string; values: string[] };
};

type Phase = {
  ID: number;
  title: string;
  sortOrder: number; // 1-based
  processDetails: Detail[];
};

type Detail = {
  ID: number;
  title: string;
  description: string; // HTML (react-quill)
  sortOrderDetails: number; // 0-based
  na: boolean;
  commentMandatory: boolean;
  relevantDocuments: RelevantDocument[];
  checklistDocuments: ChecklistDocument[];
  triggers: Trigger[];
  triggerForm: TriggerForm[];
  dependantFields: DependantField[];
  addToTimeline: TimelineEntry[] | false;
};

type RelevantDocument =
  | { Source: 'ExternalLink'; Label: 'External Link'; Link: string }
  | { Source: 'GDL'; Label: string; Link: string };

type ChecklistDocument = { Source: 'GDL'; Label: string; Link: string; Folder: '' };

type Trigger = {
  Action: 'Started' | 'Completed' | 'Deviation';
  ListName: string;
  Field: string;
  Status: string; // Choice value, or '' for DateTime
  FieldType: 'Choice' | 'DateTime';
  ActionIcon: 'Play' | 'CheckMark' | 'ReportHacked';
  Extender: string; // days for DateTime, '' otherwise
};

type TriggerForm = { SiteUrl: string; Listname: string; FormUrl: string };

type DependantField = {
  PhaseID: number;
  PhaseDetailID: number;
  PhaseTitle: string;
  PhaseDetailTitle: string;
  Status: 'Not Started';
};

type TimelineEntry = { addToTimeline: boolean; sendNotification: boolean; notify: string };

// ----- INITIAL_QCP: replaced by Claude with the in-progress state -----

const INITIAL_QCP: Qcp = {
  qcpTitle: 'Eksempel: Utviklingsprosjekt',
  binding: { list: 'ProjectGeneral', column: 'ProjectType', values: ['Utvikling'] },
  processPhases: [
    {
      ID: 1,
      title: 'Initiering',
      sortOrder: 1,
      processDetails: [
        {
          ID: 1,
          title: 'Forretningscase godkjent',
          description: '<p>Kost-nytte godkjent av styringsgruppe.</p>',
          sortOrderDetails: 0,
          na: false,
          commentMandatory: true,
          relevantDocuments: [],
          checklistDocuments: [],
          triggers: [
            { Action: 'Completed', ListName: 'ProjectGeneral', Field: 'Status', Status: 'Approved', FieldType: 'Choice', ActionIcon: 'CheckMark', Extender: '' }
          ],
          triggerForm: [],
          dependantFields: [],
          addToTimeline: [{ addToTimeline: true, sendNotification: false, notify: '' }]
        }
      ]
    }
  ]
};

// ----- Helpers -----

const ACTION_LABEL: Record<Trigger['Action'], string> = {
  Started: 'ved start',
  Completed: 'ved fullført',
  Deviation: 'ved avvik'
};

function stripHtml(html: string): string {
  return html
    .replace(/<li>/gi, '• ')
    .replace(/<\/(p|li|ul|ol|div|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function timeline(d: Detail): TimelineEntry | null {
  if (!Array.isArray(d.addToTimeline) || d.addToTimeline.length === 0) return null;
  return d.addToTimeline[0];
}

// ----- Component -----

export default function QcpPreview() {
  const qcp = INITIAL_QCP;
  const totalSteps = qcp.processPhases.reduce((n, p) => n + p.processDetails.length, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white text-slate-900 font-sans">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">{qcp.qcpTitle}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="bg-slate-100 px-2 py-1 rounded font-mono">{qcp.qcpTitle}.txt</span>
          {qcp.binding && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {qcp.binding.list} · {qcp.binding.column} = {qcp.binding.values.join(', ')}
            </span>
          )}
          <span className="bg-slate-100 px-2 py-1 rounded">
            {qcp.processPhases.length} faser · {totalSteps} sjekkpunkter
          </span>
        </div>
      </header>

      <ol className="space-y-4">
        {qcp.processPhases
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((phase, i) => (
            <PhaseView key={phase.ID} phase={phase} index={i} />
          ))}
      </ol>
    </div>
  );
}

function PhaseView({ phase, index }: { phase: Phase; index: number }) {
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
            {phase.processDetails.length} sjekkpunkter
          </span>
        </div>
        <span className="text-slate-400 text-lg">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <ol className="divide-y divide-slate-100">
          {phase.processDetails
            .slice()
            .sort((a, b) => a.sortOrderDetails - b.sortOrderDetails)
            .map((detail) => (
              <DetailView key={detail.ID} detail={detail} />
            ))}
        </ol>
      )}
    </li>
  );
}

function DetailView({ detail }: { detail: Detail }) {
  const text = stripHtml(detail.description);
  return (
    <li className="px-5 py-3">
      <div className="flex items-start gap-2 mb-1">
        <h4 className="font-medium text-slate-900">{detail.title}</h4>
        {detail.na && (
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            Kan settes N/A
          </span>
        )}
        {detail.commentMandatory && (
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
            Kommentar påkrevet
          </span>
        )}
      </div>
      {text && (
        <p className="text-sm text-slate-600 mb-2 whitespace-pre-line">{text}</p>
      )}
      <Badges detail={detail} />
    </li>
  );
}

function Badges({ detail }: { detail: Detail }) {
  const items: { label: string; tone: string }[] = [];

  for (const doc of detail.relevantDocuments) {
    items.push({
      label: doc.Source === 'GDL' ? `Styrende dokument: ${doc.Label}` : `Lenke: ${doc.Link.replace(/^https?:\/\//, '').slice(0, 40)}`,
      tone: 'bg-blue-50 text-blue-700'
    });
  }
  for (const wf of detail.checklistDocuments) {
    items.push({ label: `Arbeidsfil: ${wf.Label}`, tone: 'bg-indigo-50 text-indigo-700' });
  }
  for (const t of detail.triggers) {
    const value = t.FieldType === 'DateTime' ? `i dag + ${t.Extender || '0'} d` : t.Status;
    items.push({ label: `${t.ListName}.${t.Field} = ${value} ${ACTION_LABEL[t.Action]}`, tone: 'bg-emerald-50 text-emerald-700' });
  }
  for (const f of detail.triggerForm) {
    items.push({ label: `Skjema: ny ${f.Listname}`, tone: 'bg-emerald-50 text-emerald-700' });
  }
  for (const dep of detail.dependantFields) {
    items.push({ label: `Etter: ${dep.PhaseTitle} › ${dep.PhaseDetailTitle}`, tone: 'bg-purple-50 text-purple-700' });
  }
  const tl = timeline(detail);
  if (tl && tl.addToTimeline) {
    items.push({ label: 'Tidslinje', tone: 'bg-rose-50 text-rose-700' });
  }
  if (tl && tl.sendNotification) {
    items.push({ label: `Varsler ${tl.notify}`, tone: 'bg-rose-50 text-rose-700' });
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
