// assets/process/artifact-template.tsx
//
// Live preview of a process diagram under construction. Claude renders this artifact
// after each structural change during a /bo:process session.
//
// CONSTRAINTS:
// - Single self-contained TSX file (Claude artifacts have no node_modules access).
// - Tailwind utility classes for the chrome, inline SVG for the diagram.
// - Types embedded inline (mirror of diagram-exchange-v1.schema.json).
// - When Claude renders this, it replaces `INITIAL_DIAGRAM` with the in-progress file and
//   `CANNOT_CARRY` with what the session has learnt must be authored in Atlas afterwards.
//
// WHAT THIS PREVIEW IS AND IS NOT
// -------------------------------
// It arranges the diagram the way Atlas does when it lays one out: a column per phase, a
// band per lane, steps stacked inside each (phase, lane) cell in file order. The column
// width, header height, paddings and shape sizes are the constants from
// bo-atlas process-core (auto-layout.ts and SHAPE_DEFAULT_SIZE), so proportions are close
// to what the user will see. It is a preview, not the layout: the file carries no
// coordinates, and Atlas computes its own arrangement on import.
//
// It never shows anything the file cannot carry. Triggers, links, RACI and ISO mappings
// are listed in the "Legges inn i Atlas etterpå" panel as text, never drawn, so nobody
// mistakes the preview for a promise.

import React, { useState } from 'react';

// ----- Types (mirror diagram-exchange-v1.schema.json) -----

type Shape =
  | 'oval' | 'rect' | 'diamond' | 'document' | 'data'
  | 'subprocess' | 'manual' | 'prep' | 'delay' | 'store';

type Lane = { id: string; label: string };
type Phase = { title: string };
type Step = {
  id: string;
  title: string;
  description?: string;
  phase: string;
  lane: string;
  shape: Shape;
};
type Connector = {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  arrow?: 'end' | 'both' | 'none';
};
type Annotation = {
  id: string;
  kind: 'note' | 'connector' | 'offpage';
  text: string;
  lane?: string;
  attached_to?: string;
};
type Diagram = {
  schema_version: '1.0';
  kind: 'bo-atlas-diagram';
  process: { title: string; category_id?: string };
  lanes: Lane[];
  phases: Phase[];
  steps: Step[];
  connectors: Connector[];
  annotations?: Annotation[];
};

// ----- INITIAL_DIAGRAM: replaced by Claude with the in-progress file -----

const INITIAL_DIAGRAM: Diagram = {
  schema_version: '1.0',
  kind: 'bo-atlas-diagram',
  process: { title: 'Eksempel: Innkjøp' },
  lanes: [
    { id: 'lane-innkjoper', label: 'Innkjøper' },
    { id: 'lane-leder', label: 'Leder' },
    { id: 'lane-lager', label: 'Lager' },
  ],
  phases: [{ title: 'Behov' }, { title: 'Bestilling' }, { title: 'Mottak' }],
  steps: [
    { id: 's1', title: 'Registrer behov', phase: 'Behov', lane: 'lane-innkjoper', shape: 'oval' },
    { id: 's2', title: 'Over 50 000 kroner?', phase: 'Behov', lane: 'lane-leder', shape: 'diamond' },
    { id: 's3', title: 'Godkjenn innkjøpet', phase: 'Behov', lane: 'lane-leder', shape: 'manual' },
    { id: 's4', title: 'Send bestilling', phase: 'Bestilling', lane: 'lane-innkjoper', shape: 'document' },
    { id: 's5', title: 'Motta og kontroller varen', phase: 'Mottak', lane: 'lane-lager', shape: 'rect' },
    { id: 's6', title: 'Arkiver dokumentasjonen', phase: 'Mottak', lane: 'lane-innkjoper', shape: 'store' },
  ],
  connectors: [
    { from: 's1', to: 's2' },
    { from: 's2', to: 's3', label: 'ja' },
    { from: 's2', to: 's4', label: 'nei' },
    { from: 's3', to: 's4' },
    { from: 's4', to: 's5' },
    { from: 's5', to: 's6' },
    { from: 's5', to: 's1', label: 'avvik meldes', style: 'dashed' },
  ],
  annotations: [
    { id: 'n1', kind: 'note', text: 'Rammeavtalen går foran.', lane: 'lane-innkjoper', attached_to: 's4' },
  ],
};

// ----- CANNOT_CARRY: replaced by Claude with what must be authored in Atlas afterwards -----

const CANNOT_CARRY: string[] = [
  'Send bestilling: lenke til innkjøpsreglementet',
  'Godkjenn innkjøpet: trigger som setter prosjektstatus',
];

// ----- Layout constants, mirrored from bo-atlas process-core -----

const PHASE_COL_W = 280;
const PHASE_HEADER_H = 32;
const LANE_PADDING_Y = 16;
const NODE_GAP_Y = 14;
const LANE_LABEL_W = 110;
const MIN_LANE_H = 120;

const SHAPE_SIZE: Record<Shape, { w: number; h: number }> = {
  oval: { w: 130, h: 52 },
  rect: { w: 140, h: 60 },
  diamond: { w: 140, h: 96 },
  document: { w: 140, h: 68 },
  data: { w: 156, h: 60 },
  subprocess: { w: 150, h: 60 },
  manual: { w: 156, h: 60 },
  prep: { w: 156, h: 60 },
  delay: { w: 140, h: 60 },
  store: { w: 140, h: 68 },
};
const NOTE_SIZE = { w: 180, h: 72 };
const MARKER_SIZE = { w: 48, h: 48 };

const SHAPE_LABEL: Record<Shape, string> = {
  oval: 'start / slutt',
  rect: 'oppgave',
  diamond: 'beslutning',
  document: 'dokument',
  data: 'data',
  subprocess: 'delprosess',
  manual: 'manuell operasjon',
  prep: 'forberedelse',
  delay: 'venting',
  store: 'arkivering',
};

// ----- Layout -----

type Box = { x: number; y: number; w: number; h: number };
type Placed = {
  steps: Map<string, Box>;
  annotations: Map<string, Box>;
  laneTop: Map<string, number>;
  laneHeight: Map<string, number>;
  width: number;
  height: number;
};

function layout(d: Diagram): Placed {
  const phaseIndex = new Map(d.phases.map((p, i) => [p.title, i]));
  const annotations = d.annotations ?? [];
  const stepById = new Map(d.steps.map((s) => [s.id, s]));

  // Which cell each annotation sits in: the cell of the step it is attached to, else the
  // first column of its lane, else the first column of the first lane.
  const cellOf = (a: Annotation): { lane: string; phase: number } => {
    const anchor = a.attached_to !== undefined ? stepById.get(a.attached_to) : undefined;
    if (anchor !== undefined) return { lane: anchor.lane, phase: phaseIndex.get(anchor.phase) ?? 0 };
    return { lane: a.lane ?? d.lanes[0]?.id ?? '', phase: 0 };
  };
  const annotationBox = (a: Annotation) => (a.kind === 'note' ? NOTE_SIZE : MARKER_SIZE);

  // Stack height per (lane, phase) cell.
  const stackH = new Map<string, number>();
  const bump = (lane: string, phase: number, h: number) => {
    const key = `${lane}|${phase}`;
    stackH.set(key, (stackH.get(key) ?? 0) + h + NODE_GAP_Y);
  };
  for (const s of d.steps) bump(s.lane, phaseIndex.get(s.phase) ?? 0, SHAPE_SIZE[s.shape].h);
  for (const a of annotations) {
    const c = cellOf(a);
    bump(c.lane, c.phase, annotationBox(a).h);
  }

  const laneTop = new Map<string, number>();
  const laneHeight = new Map<string, number>();
  let y = PHASE_HEADER_H;
  for (const lane of d.lanes) {
    let tallest = 0;
    for (let p = 0; p < d.phases.length; p += 1) {
      tallest = Math.max(tallest, stackH.get(`${lane.id}|${p}`) ?? 0);
    }
    const h = Math.max(MIN_LANE_H, tallest - NODE_GAP_Y + LANE_PADDING_Y * 2);
    laneTop.set(lane.id, y);
    laneHeight.set(lane.id, h);
    y += h;
  }

  // Place, in file order, stacking inside each cell.
  const cursor = new Map<string, number>();
  const place = (lane: string, phase: number, size: { w: number; h: number }): Box => {
    const key = `${lane}|${phase}`;
    const offset = cursor.get(key) ?? 0;
    const box = {
      x: LANE_LABEL_W + phase * PHASE_COL_W + (PHASE_COL_W - size.w) / 2,
      y: (laneTop.get(lane) ?? PHASE_HEADER_H) + LANE_PADDING_Y + offset,
      w: size.w,
      h: size.h,
    };
    cursor.set(key, offset + size.h + NODE_GAP_Y);
    return box;
  };

  const steps = new Map<string, Box>();
  for (const s of d.steps) steps.set(s.id, place(s.lane, phaseIndex.get(s.phase) ?? 0, SHAPE_SIZE[s.shape]));
  const placedAnnotations = new Map<string, Box>();
  for (const a of annotations) {
    const c = cellOf(a);
    placedAnnotations.set(a.id, place(c.lane, c.phase, annotationBox(a)));
  }

  return {
    steps,
    annotations: placedAnnotations,
    laneTop,
    laneHeight,
    width: LANE_LABEL_W + d.phases.length * PHASE_COL_W,
    height: y,
  };
}

// ----- Shapes -----

function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line.length === 0 ? w : `${line} ${w}`;
    if (next.length > maxChars && line.length > 0) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line.length > 0) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].slice(0, maxChars - 1)}…`;
    return kept;
  }
  return lines;
}

function ShapeOutline({ shape, box }: { shape: Shape; box: Box }) {
  const { x, y, w, h } = box;
  const common = { fill: '#ffffff', stroke: '#1f2937', strokeWidth: 1.5 };
  switch (shape) {
    case 'oval':
      return <rect x={x} y={y} width={w} height={h} rx={h / 2} {...common} />;
    case 'diamond':
      return <polygon points={`${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`} {...common} />;
    case 'document':
      return (
        <path
          d={`M${x},${y} H${x + w} V${y + h - 10} Q${x + w * 0.75},${y + h - 22} ${x + w / 2},${y + h - 10} T${x},${y + h - 10} Z`}
          {...common}
        />
      );
    case 'data':
      return <polygon points={`${x + 14},${y} ${x + w},${y} ${x + w - 14},${y + h} ${x},${y + h}`} {...common} />;
    case 'subprocess':
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} rx={3} {...common} />
          <line x1={x + 8} y1={y} x2={x + 8} y2={y + h} stroke="#1f2937" strokeWidth={1.5} />
          <line x1={x + w - 8} y1={y} x2={x + w - 8} y2={y + h} stroke="#1f2937" strokeWidth={1.5} />
        </g>
      );
    case 'manual':
      return <polygon points={`${x},${y} ${x + w},${y} ${x + w - 16},${y + h} ${x + 16},${y + h}`} {...common} />;
    case 'prep':
      return <polygon points={`${x + 14},${y} ${x + w - 14},${y} ${x + w},${y + h / 2} ${x + w - 14},${y + h} ${x + 14},${y + h} ${x},${y + h / 2}`} {...common} />;
    case 'delay':
      return <path d={`M${x},${y} H${x + w - h / 2} A${h / 2},${h / 2} 0 0 1 ${x + w - h / 2},${y + h} H${x} Z`} {...common} />;
    case 'store':
      return (
        <g>
          <path d={`M${x},${y + 8} A${w / 2},8 0 0 1 ${x + w},${y + 8} V${y + h - 8} A${w / 2},8 0 0 1 ${x},${y + h - 8} Z`} {...common} />
          <path d={`M${x},${y + 8} A${w / 2},8 0 0 0 ${x + w},${y + 8}`} fill="none" stroke="#1f2937" strokeWidth={1.5} />
        </g>
      );
    case 'rect':
    default:
      return <rect x={x} y={y} width={w} height={h} rx={4} {...common} />;
  }
}

function StepNode({ step, box, selected, onClick }: { step: Step; box: Box; selected: boolean; onClick: () => void }) {
  const lines = wrap(step.title, step.shape === 'diamond' ? 14 : 18, 3);
  const lineH = 14;
  const startY = box.y + box.h / 2 - ((lines.length - 1) * lineH) / 2;
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }} filter={selected ? 'url(#selected)' : undefined}>
      <ShapeOutline shape={step.shape} box={box} />
      <text textAnchor="middle" fontSize={12} fontFamily="ui-sans-serif, system-ui, sans-serif" fill="#111827">
        {lines.map((l, i) => (
          <tspan key={i} x={box.x + box.w / 2} y={startY + i * lineH + 4}>{l}</tspan>
        ))}
      </text>
    </g>
  );
}

function AnnotationNode({ a, box }: { a: Annotation; box: Box }) {
  if (a.kind === 'note') {
    const lines = wrap(a.text, 26, 4);
    return (
      <g>
        <path
          d={`M${box.x},${box.y} H${box.x + box.w - 12} L${box.x + box.w},${box.y + 12} V${box.y + box.h} H${box.x} Z`}
          fill="#fef9c3" stroke="#ca8a04" strokeWidth={1}
        />
        <text fontSize={11} fontFamily="ui-sans-serif, system-ui, sans-serif" fill="#422006">
          {lines.map((l, i) => (
            <tspan key={i} x={box.x + 8} y={box.y + 16 + i * 13}>{l}</tspan>
          ))}
        </text>
      </g>
    );
  }
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  if (a.kind === 'offpage') {
    return (
      <g>
        <polygon
          points={`${box.x},${box.y} ${box.x + box.w},${box.y} ${box.x + box.w},${box.y + box.h - 14} ${cx},${box.y + box.h} ${box.x},${box.y + box.h - 14}`}
          fill="#eef2ff" stroke="#4f46e5" strokeWidth={1}
        />
        <text x={cx} y={cy} textAnchor="middle" fontSize={9} fill="#312e81">{wrap(a.text, 9, 1)[0]}</text>
      </g>
    );
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={box.w / 2} fill="#eef2ff" stroke="#4f46e5" strokeWidth={1} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={12} fill="#312e81">{a.text.slice(0, 3)}</text>
    </g>
  );
}

// ----- Connectors -----

function anchors(from: Box, to: Box): { x1: number; y1: number; x2: number; y2: number; backward: boolean } {
  const fc = { x: from.x + from.w / 2, y: from.y + from.h / 2 };
  const tc = { x: to.x + to.w / 2, y: to.y + to.h / 2 };
  const dx = tc.x - fc.x;
  const dy = tc.y - fc.y;
  if (Math.abs(dx) > from.w / 2 + to.w / 2) {
    // Different columns: leave from a side, arrive at a side.
    const backward = dx < 0;
    return {
      x1: backward ? from.x : from.x + from.w,
      y1: fc.y,
      x2: backward ? to.x + to.w : to.x,
      y2: tc.y,
      backward,
    };
  }
  // Same column: leave from the bottom or top.
  const down = dy > 0;
  return {
    x1: fc.x,
    y1: down ? from.y + from.h : from.y,
    x2: tc.x,
    y2: down ? to.y : to.y + to.h,
    backward: !down,
  };
}

function ConnectorLine({ c, from, to }: { c: Connector; from: Box; to: Box }) {
  const a = anchors(from, to);
  const style = c.style ?? 'solid';
  const arrow = c.arrow ?? 'end';
  const dash = style === 'dashed' ? '7 5' : style === 'dotted' ? '2 4' : undefined;
  // A backward line bows below the boxes so it does not run through them.
  const bow = a.backward ? Math.max(from.h, to.h) : 0;
  const mx = (a.x1 + a.x2) / 2;
  const my = (a.y1 + a.y2) / 2 + bow;
  const d = a.backward
    ? `M${a.x1},${a.y1} Q${mx},${my + bow} ${a.x2},${a.y2}`
    : `M${a.x1},${a.y1} L${a.x2},${a.y2}`;
  const labelY = my + (a.backward ? bow / 2 : 0);
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="#374151"
        strokeWidth={1.5}
        strokeDasharray={dash}
        markerEnd={arrow === 'end' || arrow === 'both' ? 'url(#arrow)' : undefined}
        markerStart={arrow === 'both' ? 'url(#arrow-start)' : undefined}
      />
      {c.label !== undefined && c.label.length > 0 && (
        <g>
          <rect x={mx - c.label.length * 3.2 - 4} y={labelY - 9} width={c.label.length * 6.4 + 8} height={16} rx={3} fill="#ffffff" stroke="#d1d5db" />
          <text x={mx} y={labelY + 3} textAnchor="middle" fontSize={11} fill="#374151">{c.label}</text>
        </g>
      )}
    </g>
  );
}

// ----- The component -----

export default function ProcessDiagramPreview() {
  const d = INITIAL_DIAGRAM;
  const placed = layout(d);
  const [selected, setSelected] = useState<string | null>(null);
  const [openPhase, setOpenPhase] = useState<string | null>(d.phases[0]?.title ?? null);

  const stepById = new Map(d.steps.map((s) => [s.id, s]));
  const annotations = d.annotations ?? [];
  const selectedStep = selected !== null ? stepById.get(selected) : undefined;
  const decisions = d.steps.filter((s) => s.shape === 'diamond');
  const usedShapes = Array.from(new Set(d.steps.map((s) => s.shape)));
  const laneLabel = (id: string) => d.lanes.find((l) => l.id === id)?.label ?? id;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 space-y-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">{d.process.title}</h1>
          <p className="text-sm text-gray-600">
            {d.lanes.length} roller · {d.phases.length} faser · {d.steps.length} steg · {d.connectors.length} forbindelser
            {annotations.length > 0 ? ` · ${annotations.length} notater` : ''}
          </p>
        </div>
        <p className="text-xs text-gray-500">Forhåndsvisning. Atlas plasserer selv ved import.</p>
      </header>

      <div className="overflow-auto rounded border border-gray-200 bg-white">
        <svg width={placed.width} height={placed.height} viewBox={`0 0 ${placed.width} ${placed.height}`}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="#374151" />
            </marker>
            <marker id="arrow-start" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M10,0 L0,5 L10,10 Z" fill="#374151" />
            </marker>
            <filter id="selected" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Phase headers */}
          {d.phases.map((p, i) => (
            <g key={p.title}>
              <rect x={LANE_LABEL_W + i * PHASE_COL_W} y={0} width={PHASE_COL_W} height={PHASE_HEADER_H} fill="#e5e7eb" stroke="#d1d5db" />
              <text x={LANE_LABEL_W + i * PHASE_COL_W + PHASE_COL_W / 2} y={PHASE_HEADER_H / 2 + 4} textAnchor="middle" fontSize={13} fontWeight={600} fill="#111827">
                {p.title}
              </text>
            </g>
          ))}

          {/* Lane bands */}
          {d.lanes.map((lane, i) => {
            const top = placed.laneTop.get(lane.id) ?? 0;
            const h = placed.laneHeight.get(lane.id) ?? MIN_LANE_H;
            const labelLines = wrap(lane.label, 14, 2);
            return (
              <g key={lane.id}>
                <rect x={0} y={top} width={placed.width} height={h} fill={i % 2 === 0 ? '#ffffff' : '#f9fafb'} stroke="#d1d5db" />
                <rect x={0} y={top} width={LANE_LABEL_W} height={h} fill="#f3f4f6" stroke="#d1d5db" />
                <text textAnchor="middle" fontSize={12} fontWeight={600} fill="#111827">
                  {labelLines.map((l, j) => (
                    <tspan key={j} x={LANE_LABEL_W / 2} y={top + h / 2 + 4 - ((labelLines.length - 1) * 7) + j * 14}>{l}</tspan>
                  ))}
                </text>
              </g>
            );
          })}

          {/* Phase column separators */}
          {d.phases.map((p, i) => (
            <line key={`sep-${p.title}`} x1={LANE_LABEL_W + i * PHASE_COL_W} y1={0} x2={LANE_LABEL_W + i * PHASE_COL_W} y2={placed.height} stroke="#d1d5db" />
          ))}

          {/* Association lines, derived from attached_to, never stored */}
          {annotations.map((a) => {
            const box = placed.annotations.get(a.id);
            const anchor = a.attached_to !== undefined ? placed.steps.get(a.attached_to) : undefined;
            if (box === undefined || anchor === undefined) return null;
            return (
              <line
                key={`assoc-${a.id}`}
                x1={box.x + box.w / 2} y1={box.y}
                x2={anchor.x + anchor.w / 2} y2={anchor.y + anchor.h}
                stroke="#9ca3af" strokeWidth={1} strokeDasharray="2 3"
              />
            );
          })}

          {/* Connectors */}
          {d.connectors.map((c, i) => {
            const from = placed.steps.get(c.from);
            const to = placed.steps.get(c.to);
            if (from === undefined || to === undefined) return null;
            return <ConnectorLine key={`${c.from}-${c.to}-${i}`} c={c} from={from} to={to} />;
          })}

          {/* Steps */}
          {d.steps.map((s) => {
            const box = placed.steps.get(s.id);
            if (box === undefined) return null;
            return <StepNode key={s.id} step={s} box={box} selected={selected === s.id} onClick={() => setSelected(selected === s.id ? null : s.id)} />;
          })}

          {/* Annotations */}
          {annotations.map((a) => {
            const box = placed.annotations.get(a.id);
            if (box === undefined) return null;
            return <AnnotationNode key={a.id} a={a} box={box} />;
          })}
        </svg>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Selected step */}
        <section className="rounded border border-gray-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-gray-700">Valgt steg</h2>
          {selectedStep === undefined ? (
            <p className="mt-1 text-sm text-gray-500">Klikk på et steg i diagrammet.</p>
          ) : (
            <div className="mt-1 space-y-1 text-sm">
              <p className="font-medium">{selectedStep.title}</p>
              <p className="text-gray-600">
                {laneLabel(selectedStep.lane)} · {selectedStep.phase} · {SHAPE_LABEL[selectedStep.shape]}
              </p>
              <p className="text-gray-700">
                {selectedStep.description === undefined
                  ? <span className="italic text-gray-400">Ingen beskrivelse</span>
                  : selectedStep.description === '' ? <span className="italic text-gray-400">Beskrivelse tømt</span> : selectedStep.description}
              </p>
              <p className="text-xs text-gray-500">
                Inn: {d.connectors.filter((c) => c.to === selectedStep.id).map((c) => stepById.get(c.from)?.title ?? c.from).join(', ') || 'ingen'}
                <br />
                Ut: {d.connectors.filter((c) => c.from === selectedStep.id).map((c) => `${stepById.get(c.to)?.title ?? c.to}${c.label ? ` (${c.label})` : ''}`).join(', ') || 'ingen'}
              </p>
              <p className="text-xs text-gray-400">id: {selectedStep.id}</p>
            </div>
          )}
        </section>

        {/* Phases and steps */}
        <section className="rounded border border-gray-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-gray-700">Faser og steg</h2>
          <ul className="mt-1 space-y-1 text-sm">
            {d.phases.map((p) => {
              const steps = d.steps.filter((s) => s.phase === p.title);
              const open = openPhase === p.title;
              return (
                <li key={p.title}>
                  <button type="button" className="w-full text-left font-medium hover:underline" onClick={() => setOpenPhase(open ? null : p.title)}>
                    {open ? '▾' : '▸'} {p.title} <span className="text-gray-400">({steps.length})</span>
                  </button>
                  {open && (
                    <ol className="ml-4 list-decimal text-gray-700">
                      {steps.map((s) => (
                        <li key={s.id}>
                          <button type="button" className="text-left hover:underline" onClick={() => setSelected(s.id)}>
                            {s.title}
                          </button>{' '}
                          <span className="text-xs text-gray-400">{laneLabel(s.lane)}</span>
                        </li>
                      ))}
                      {steps.length === 0 && <li className="list-none italic text-amber-700">Tom fase</li>}
                    </ol>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Decisions, legend, cannot carry */}
        <section className="space-y-3">
          <div className="rounded border border-gray-200 bg-white p-3">
            <h2 className="text-sm font-semibold text-gray-700">Beslutninger</h2>
            {decisions.length === 0 ? (
              <p className="mt-1 text-sm text-gray-500">Ingen.</p>
            ) : (
              <ul className="mt-1 space-y-1 text-sm">
                {decisions.map((s) => {
                  const exits = d.connectors.filter((c) => c.from === s.id);
                  return (
                    <li key={s.id}>
                      <span className="font-medium">{s.title}</span>
                      <ul className="ml-4 text-gray-700">
                        {exits.map((c, i) => (
                          <li key={i}>
                            {c.label ? <span>{c.label}</span> : <span className="italic text-amber-700">uten etikett</span>}
                            {' → '}{stepById.get(c.to)?.title ?? c.to}
                          </li>
                        ))}
                        {exits.length < 2 && <li className="italic text-amber-700">Bare {exits.length} utgang</li>}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded border border-gray-200 bg-white p-3">
            <h2 className="text-sm font-semibold text-gray-700">Tegnforklaring</h2>
            <ul className="mt-1 grid grid-cols-2 gap-x-2 text-xs text-gray-700">
              {usedShapes.map((s) => (
                <li key={s}><code className="text-gray-500">{s}</code> {SHAPE_LABEL[s]}</li>
              ))}
            </ul>
            <p className="mt-1 text-xs text-gray-500">Heltrukket: arbeidet går videre. Stiplet: informasjon. Prikket: tilknytning.</p>
          </div>

          <div className="rounded border border-amber-200 bg-amber-50 p-3">
            <h2 className="text-sm font-semibold text-amber-900">Legges inn i Atlas etterpå</h2>
            <p className="text-xs text-amber-800">Filen bærer bare tegningen. Dette er nevnt i samtalen og må legges inn i Atlas etter import:</p>
            {CANNOT_CARRY.length === 0 ? (
              <p className="mt-1 text-sm text-amber-900">Ingenting notert ennå.</p>
            ) : (
              <ul className="mt-1 list-disc pl-4 text-sm text-amber-900">
                {CANNOT_CARRY.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
