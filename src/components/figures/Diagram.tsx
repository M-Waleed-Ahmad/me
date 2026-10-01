import React from 'react';

/*
  Small declarative diagram renderer for architecture and pipeline figures.
  Nodes are whiteboard-style boxes, edges are arrows clipped to box edges, and
  annotations are margin notes with a leader line pointing at the thing they
  describe. Everything themes through CSS variables.
*/

export type DiagramNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  sub?: string;
  w?: number;
  h?: number;
  /** Draw with an accent outline to mark the focal part of the figure. */
  emphasis?: boolean;
  /** Dashed outline for things outside the system boundary. */
  external?: boolean;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  /** Offsets the label from the midpoint. */
  labelDx?: number;
  labelDy?: number;
  /** Bend the edge: positive/negative curvature in px at the midpoint. */
  bend?: number;
};

export type DiagramNote = {
  x: number;
  y: number;
  lines: string[];
  anchor?: 'start' | 'middle' | 'end';
  /** Point the leader line at this coordinate. */
  to?: [number, number];
};

type Props = {
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  notes?: DiagramNote[];
  title: string;
  /** Optional extra SVG drawn under the nodes (lanes, brackets, boundaries). */
  underlay?: React.ReactNode;
  idPrefix: string;
  /**
   * Node ids and edge keys ("from>to") to emphasise. When set, everything else
   * fades back, which is how the walk-through steps through a system.
   */
  highlight?: string[];
};

const DEFAULT_W = 150;
const DEFAULT_H = 54;

function size(n: DiagramNode) {
  return { w: n.w ?? DEFAULT_W, h: n.h ?? DEFAULT_H };
}

/** Where the segment from the box centre towards (tx, ty) leaves the box. */
function exitPoint(n: DiagramNode, tx: number, ty: number, pad = 0) {
  const { w, h } = size(n);
  const dx = tx - n.x;
  const dy = ty - n.y;
  if (dx === 0 && dy === 0) return { x: n.x, y: n.y };
  const sx = (w / 2 + pad) / Math.abs(dx || 1e-9);
  const sy = (h / 2 + pad) / Math.abs(dy || 1e-9);
  const s = Math.min(sx, sy);
  return { x: n.x + dx * s, y: n.y + dy * s };
}

export default function Diagram({ width, height, nodes, edges, notes = [], title, underlay, idPrefix, highlight }: Props) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const focus = highlight && highlight.length > 0 ? new Set(highlight) : null;
  const fade = { transition: 'opacity 220ms ease, stroke 220ms ease' };
  const arrow = `${idPrefix}-arrow`;
  const arrowAccent = `${idPrefix}-arrow-accent`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label={title}>
      <title>{title}</title>
      <defs>
        <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-ink-2)" />
        </marker>
        <marker id={arrowAccent} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent)" />
        </marker>
      </defs>

      {underlay}

      {/* Edges */}
      <g fill="none">
        {edges.map((e) => {
          const a = byId.get(e.from);
          const b = byId.get(e.to);
          if (!a || !b) return null;
          const bend = e.bend ?? 0;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          // Control point perpendicular to the straight line, for bent edges.
          const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          const cx = mx + (-(b.y - a.y) / len) * bend;
          const cy = my + ((b.x - a.x) / len) * bend;
          const start = exitPoint(a, bend ? cx : b.x, bend ? cy : b.y, 2);
          const end = exitPoint(b, bend ? cx : a.x, bend ? cy : a.y, 6);
          const d = bend
            ? `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`
            : `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
          const lx = (bend ? (start.x + 2 * cx + end.x) / 4 : (start.x + end.x) / 2) + (e.labelDx ?? 0);
          const ly = (bend ? (start.y + 2 * cy + end.y) / 4 : (start.y + end.y) / 2) + (e.labelDy ?? -7);
          const lit = focus?.has(`${e.from}>${e.to}`) ?? false;
          return (
            <g key={`${e.from}-${e.to}`} opacity={focus && !lit ? 0.25 : 1} style={fade}>
              <path
                d={d}
                stroke={lit ? 'var(--color-accent)' : 'var(--color-ink-2)'}
                strokeWidth={lit ? 1.8 : 1.2}
                strokeDasharray={e.dashed ? '4 4' : undefined}
                markerEnd={`url(#${lit ? arrowAccent : arrow})`}
                style={fade}
              />
              {e.label && (
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  fontSize={12.5}
                  className="font-mono"
                  fill="var(--color-ink-3)"
                  stroke="var(--color-surface)"
                  strokeWidth={5}
                  paintOrder="stroke"
                  strokeLinejoin="round"
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* Nodes */}
      {nodes.map((n) => {
        const { w, h } = size(n);
        const lit = focus?.has(n.id) ?? false;
        const accent = focus ? lit : n.emphasis;
        return (
          <g key={n.id} opacity={focus && !lit ? 0.3 : 1} style={fade}>
            <rect
              x={n.x - w / 2}
              y={n.y - h / 2}
              width={w}
              height={h}
              rx={2}
              fill="var(--color-surface)"
              stroke={accent ? 'var(--color-accent)' : 'var(--color-ink-2)'}
              strokeWidth={accent ? 1.8 : 1.1}
              strokeDasharray={n.external ? '5 4' : undefined}
              style={fade}
            />
            <text
              x={n.x}
              y={n.sub ? n.y - 5 : n.y}
              dy={n.sub ? 0 : '0.35em'}
              textAnchor="middle"
              fontSize={16}
              className="font-serif"
              fill="var(--color-ink)"
            >
              {n.label}
            </text>
            {n.sub && (
              <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize={12} className="font-mono" fill="var(--color-ink-3)">
                {n.sub}
              </text>
            )}
          </g>
        );
      })}

      {/* Annotations */}
      {notes.map((note, i) => {
        const anchor = note.anchor ?? 'start';
        const lineHeight = 18;
        const textTop = note.y;
        let leader: React.ReactNode = null;
        if (note.to) {
          const [tx, ty] = note.to;
          const fromX = note.x + (anchor === 'end' ? 6 : anchor === 'start' ? -6 : 0);
          const fromY = textTop + ((note.lines.length - 1) * lineHeight) / 2 - 4;
          const midX = (fromX + tx) / 2;
          leader = (
            <>
              <path
                d={`M ${fromX} ${fromY} Q ${midX} ${fromY + (ty > fromY ? -16 : 16)} ${tx} ${ty}`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={1}
                markerEnd={`url(#${arrowAccent})`}
              />
            </>
          );
        }
        return (
          <g key={i} opacity={focus ? 0 : 1} style={fade}>
            {leader}
            <text
              x={note.x}
              y={textTop}
              textAnchor={anchor}
              fontSize={16}
              fontStyle="italic"
              className="font-serif"
              fill="var(--color-accent-ink)"
              stroke="var(--color-surface)"
              strokeWidth={4}
              paintOrder="stroke"
              strokeLinejoin="round"
            >
              {note.lines.map((line, j) => (
                <tspan key={j} x={note.x} dy={j === 0 ? 0 : lineHeight}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
