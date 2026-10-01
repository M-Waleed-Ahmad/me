'use client';

import React, { useMemo, useState } from 'react';
import { workspaceEdges, workspaceNodes, WorkspaceNode } from '@/data/workspaceData';

/*
  A curated, deterministic layout of the workspace graph: where I worked, what I
  built there, and the stack underneath. Columns are ordered by hand to keep edge
  crossings low; a force layout is avoided on purpose so the figure reads the same
  every time.
*/

const LEFT = ['ashtex', 'axelliant', 'arrivy', 'fast'];
const MIDDLE = ['wepsych', 'arabia-hills', 'alfa-club', 'automation', 'cicd', 'testing', 'deepshield', 'robotics'];
const RIGHT = [
  'flutter', 'supabase', 'postgresql', 'react', 'makecom', 'cloudinary',
  'github-actions', 'playwright', 'cypress', 'python', 'fastapi', 'pytorch', 'opencv',
];

const WIDTH = 640;
const TOP = 44;
const ROW = 27;
const HEIGHT = TOP + ROW * (RIGHT.length - 1) + 28;

const X = {
  leftPort: 132,
  midIn: 222,
  midOut: 418,
  rightPort: 490,
};

const SHORT_LABELS: Record<string, string> = {
  automation: 'Workflow automation',
  robotics: 'Robotics skills',
  fast: 'FAST NUCES',
  ashtex: 'Ashtex',
};

type Column = 'left' | 'middle' | 'right';
type Placed = { node: WorkspaceNode; column: Column; y: number };

function spread(ids: string[]): Map<string, number> {
  const span = ROW * (RIGHT.length - 1);
  const step = ids.length > 1 ? span / (ids.length - 1) : 0;
  const inset = ids.length < RIGHT.length ? step * 0.12 : 0;
  const usable = span - inset * 2;
  const realStep = ids.length > 1 ? usable / (ids.length - 1) : 0;
  return new Map(ids.map((id, i) => [id, TOP + inset + realStep * i]));
}

function curve(x1: number, y1: number, x2: number, y2: number) {
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}

type MapProps = {
  /**
   * When provided, clicking a project calls this (with its position as a fraction
   * of the figure) instead of following the project's link.
   */
  onSelect?: (id: string, at: { x: number; y: number }) => void;
  /** Project to keep traced while nothing is hovered. */
  selected?: string | null;
  /** Node traced from outside the map (e.g. hovering a row in a project list). */
  highlight?: string | null;
  /** Column headings; `titles` renders them as plain-language serif headings. */
  headings?: 'labels' | 'titles';
  /** Trace the lines in and fade the labels column by column on first render. */
  drawIn?: boolean;
};

/** Entrance timing (ms): labels by column, then lines left to right. */
const COLUMN_DELAY = { left: 100, middle: 250, right: 450 };
const EDGE_DELAY = { left: 350, right: 650 };

const HEADINGS = {
  labels: ['experience', 'work', 'stack'],
  titles: ['Where I worked', 'What I built', 'What it runs on'],
};

export default function ConnectionMap({ onSelect, selected = null, highlight = null, headings = 'labels', drawIn = true }: MapProps = {}) {
  const [hovered, setActive] = useState<string | null>(null);
  const active = hovered ?? highlight ?? selected;

  const { placed, edges } = useMemo(() => {
    const byId = new Map(workspaceNodes.map((n) => [n.id, n]));
    const yLeft = spread(LEFT);
    const yMid = spread(MIDDLE);
    const yRight = spread(RIGHT);
    const placed = new Map<string, Placed>();
    LEFT.forEach((id) => placed.set(id, { node: byId.get(id)!, column: 'left', y: yLeft.get(id)! }));
    MIDDLE.forEach((id) => placed.set(id, { node: byId.get(id)!, column: 'middle', y: yMid.get(id)! }));
    RIGHT.forEach((id) => placed.set(id, { node: byId.get(id)!, column: 'right', y: yRight.get(id)! }));

    const edges = workspaceEdges
      .map((e) => {
        const a = placed.get(e.source);
        const b = placed.get(e.target);
        if (!a || !b) return null;
        if (a.column === 'left' && b.column === 'middle') return { id: `${e.source}>${e.target}`, from: e.source, to: e.target, d: curve(X.leftPort, a.y, X.midIn, b.y) };
        if (a.column === 'middle' && b.column === 'right') return { id: `${e.source}>${e.target}`, from: e.source, to: e.target, d: curve(X.midOut, a.y, X.rightPort, b.y) };
        return null;
      })
      .filter((e): e is { id: string; from: string; to: string; d: string } => e !== null);

    return { placed, edges };
  }, []);

  // Hovering an outer node traces through the project to the far column,
  // so "Axelliant" lights up CI/CD, Testing and the tools behind them.
  const lit = useMemo(() => {
    const litEdges = new Set<string>();
    const litNodes = new Set<string>();
    if (!active) return { litEdges, litNodes };
    const column = placed.get(active)?.column;
    litNodes.add(active);

    const touching = (id: string) => edges.filter((e) => e.from === id || e.to === id);
    const mids = column === 'middle' ? [active] : touching(active).map((e) => (e.from === active ? e.to : e.from));

    for (const e of touching(active)) litEdges.add(e.id);
    for (const mid of mids) {
      litNodes.add(mid);
      for (const e of touching(mid)) {
        const other = e.from === mid ? e.to : e.from;
        const otherColumn = placed.get(other)?.column;
        if (column === 'middle' || (column === 'left' && otherColumn === 'right') || (column === 'right' && otherColumn === 'left')) {
          litEdges.add(e.id);
          litNodes.add(other);
        }
      }
    }
    return { litEdges, litNodes };
  }, [active, edges, placed]);

  const dim = active !== null;

  const nodeProps = (id: string) => ({
    onMouseEnter: () => setActive(id),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(id),
    onBlur: () => setActive(null),
  });

  const labelFill = (id: string, base: string) =>
    !dim ? base : lit.litNodes.has(id) ? 'var(--color-ink)' : 'var(--color-rule-strong)';

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="block h-auto w-full"
      role="img"
      aria-labelledby="connection-map-title"
    >
      <title id="connection-map-title">
        Map linking my roles (Ashtex, Axelliant, Arrivy, FAST NUCES) to the projects built there and the technologies underneath them.
      </title>

      {HEADINGS[headings].map((heading, i) => (
        <text
          key={heading}
          x={[X.leftPort, (X.midIn + X.midOut) / 2, X.rightPort][i]}
          y={18}
          textAnchor={['end', 'middle', 'start'][i] as 'end' | 'middle' | 'start'}
          className={headings === 'titles' ? 'font-serif' : 'font-mono'}
          fontSize={headings === 'titles' ? 17 : 12}
          fontStyle={headings === 'titles' ? 'italic' : undefined}
          fill={headings === 'titles' ? 'var(--color-accent-ink)' : 'var(--color-ink-3)'}
        >
          {heading}
        </text>
      ))}

      <g fill="none">
        {edges.map((e, i) => {
          const on = lit.litEdges.has(e.id);
          const fromLeft = placed.get(e.from)?.column === 'left';
          return (
            <path
              key={e.id}
              d={e.d}
              pathLength={drawIn ? 1 : undefined}
              className={drawIn ? 'ink-line' : undefined}
              stroke={on ? 'var(--color-accent)' : 'var(--color-rule-strong)'}
              strokeWidth={on ? 1.6 : 1}
              strokeOpacity={dim && !on ? 0.35 : 0.9}
              style={{
                transition: 'stroke 160ms, stroke-opacity 160ms',
                animationDelay: drawIn ? `calc(var(--map-offset, 0s) + ${(fromLeft ? EDGE_DELAY.left : EDGE_DELAY.right) + i * 18}ms)` : undefined,
              }}
            />
          );
        })}
      </g>

      {[...placed.values()].map(({ node, column, y }, index) => (
        <g
          key={node.id}
          className={drawIn ? 'ink-label' : undefined}
          style={drawIn ? { animationDelay: `calc(var(--map-offset, 0s) + ${COLUMN_DELAY[column] + (index % 13) * 25}ms)` } : undefined}
        >
          {renderNode(node, column, y)}
        </g>
      ))}
    </svg>
  );

  function renderNode(node: WorkspaceNode, column: Column, y: number) {
        const label = SHORT_LABELS[node.id] ?? node.label;
        const on = lit.litNodes.has(node.id);
        const dotFill = on ? 'var(--color-accent)' : 'var(--color-paper)';
        const dotStroke = on ? 'var(--color-accent)' : 'var(--color-ink-3)';

        if (column === 'middle') {
          const content = (
            <>
              <circle cx={X.midIn} cy={y} r={3} fill={dotFill} stroke={dotStroke} />
              <circle cx={X.midOut} cy={y} r={3} fill={dotFill} stroke={dotStroke} />
              <text
                x={(X.midIn + X.midOut) / 2}
                y={y}
                dy="0.35em"
                textAnchor="middle"
                fontSize={18}
                className="font-serif"
                fill={labelFill(node.id, 'var(--color-ink)')}
                style={{ transition: 'fill 160ms' }}
              >
                {label}
              </text>
            </>
          );
          const hitArea = <rect x={X.midIn + 8} y={y - 11} width={X.midOut - X.midIn - 16} height={22} fill="transparent" />;
          if (onSelect) {
            const select = () => onSelect(node.id, { x: (X.midIn + X.midOut) / 2 / WIDTH, y: y / HEIGHT });
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-label={`Open ${node.label}`}
                aria-pressed={selected === node.id}
                className="cursor-pointer outline-none"
                onClick={select}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    select();
                  }
                }}
                {...nodeProps(node.id)}
              >
                {hitArea}
                {content}
              </g>
            );
          }
          return node.url ? (
            <a key={node.id} href={node.url} {...nodeProps(node.id)} aria-label={`${node.label} — open`}>
              {hitArea}
              {content}
            </a>
          ) : (
            <g key={node.id} tabIndex={0} {...nodeProps(node.id)}>{content}</g>
          );
        }

        const isLeft = column === 'left';
        const port = isLeft ? X.leftPort : X.rightPort;
        return (
          <g key={node.id} tabIndex={0} {...nodeProps(node.id)} className="cursor-default outline-none">
            <rect
              x={isLeft ? 0 : port}
              y={y - 10}
              width={isLeft ? port : WIDTH - port}
              height={20}
              fill="transparent"
            />
            <circle cx={port} cy={y} r={2.75} fill={dotFill} stroke={dotStroke} />
            <text
              x={isLeft ? port - 9 : port + 9}
              y={y}
              dy="0.35em"
              textAnchor={isLeft ? 'end' : 'start'}
              fontSize={isLeft ? 15 : 13.5}
              className={isLeft ? 'font-sans' : 'font-mono'}
              fill={labelFill(node.id, isLeft ? 'var(--color-ink)' : 'var(--color-ink-2)')}
              style={{ transition: 'fill 160ms' }}
            >
              {label}
            </text>
          </g>
        );
  }
}
