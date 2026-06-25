'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceNode } from '@/data/workspaceData';
import { LaidOutEdge, LaidOutNode, useNeighborhoodGraph } from './useNeighborhoodGraph';

// Single accent family (no second hue exists in the theme) — node types are
// told apart by fill weight instead of color: pillars get the brightest
// fill (they're the structural anchors), projects/concepts get a mid
// outline treatment, technology and experience stay dim/outlined so the
// pillar and project tier still reads as the "trunk" of whatever is focused.
const nodeTreatment: Record<
  WorkspaceNode['type'],
  { fill: string; stroke: string; filled: boolean }
> = {
  pillar: { fill: 'var(--color-accent-bright)', stroke: 'var(--color-accent-bright)', filled: true },
  project: { fill: 'var(--color-bg-panel)', stroke: 'var(--color-accent)', filled: false },
  technology: { fill: 'var(--color-bg-panel)', stroke: 'var(--color-text-muted)', filled: false },
  concept: { fill: 'var(--color-bg-panel)', stroke: 'var(--color-accent-dim)', filled: false },
  experience: { fill: 'var(--color-bg-panel)', stroke: 'var(--color-text-secondary)', filled: false },
};

interface GraphPreviewProps {
  focusId: string;
  onSelect: (id: string) => void;
}

export function GraphPreview({ focusId, onSelect }: GraphPreviewProps) {
  const { laidOutNodes, laidOutEdges, width, height } = useNeighborhoodGraph(focusId);

  // SVG viewBox is the single coordinate authority. preserveAspectRatio is
  // set explicitly (rather than relying on the SVG default) so there is no
  // ambiguity about how the WIDTHxHEIGHT simulation space maps onto the
  // rendered box — "xMidYMid meet" letterboxes evenly on both axes instead
  // of stretching, which is what we want since collide/clamp math in the
  // hook assumes square-ish, undistorted units.
  return (
    <div className="relative bg-bg-dark" style={{ aspectRatio: `${width} / ${height}` }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        role="img"
        aria-label={`Graph of connections around ${focusId}`}
        style={{ display: 'block' }}
      >
        {/* Faint grid texture, scoped to the same coordinate space as the graph */}
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="var(--color-text-primary)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" opacity={0.04} />

        {/* Edges drawn first so nodes sit on top */}
        <g>
          {laidOutEdges.map((edge) => (
            <EdgeLine key={edge.id} edge={edge} />
          ))}
        </g>

        <g>
          <AnimatePresence>
            {laidOutNodes.map((laidOut) => (
              <NodeDot key={laidOut.node.id} laidOut={laidOut} onSelect={onSelect} />
            ))}
          </AnimatePresence>
        </g>
      </svg>
    </div>
  );
}

function EdgeLine({ edge }: { edge: LaidOutEdge }) {
  const isFocusEdge = edge.source.isFocus || edge.target.isFocus;

  return (
    <motion.line
      x1={edge.source.x}
      y1={edge.source.y}
      x2={edge.target.x}
      y2={edge.target.y}
      stroke={isFocusEdge ? 'var(--color-accent)' : 'var(--color-border-muted)'}
      strokeOpacity={isFocusEdge ? 0.5 : 0.6}
      strokeWidth={isFocusEdge ? 1.2 : 1}
      strokeDasharray={isFocusEdge ? '0' : '3 4'}
      animate={{
        x1: edge.source.x,
        y1: edge.source.y,
        x2: edge.target.x,
        y2: edge.target.y,
      }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      initial={false}
    />
  );
}

function NodeDot({
  laidOut,
  onSelect,
}: {
  laidOut: LaidOutNode;
  onSelect: (id: string) => void;
}) {
  const { node, x, y, r, isFocus } = laidOut;
  const treatment = nodeTreatment[node.type];

  // Every positioned element (circle, ring, text) carries its own cx/cy or
  // x/y directly in SVG user-space units — none of them sit inside a <g>
  // with a transform, and the <g> wrapper here has no transform of its
  // own. One coordinate system, no compounding offsets.
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Focus on ${node.label}`}
      onClick={() => onSelect(node.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(node.id);
      }}
      className="cursor-pointer outline-none"
    >
      {isFocus && (
        <motion.circle
          cx={x}
          cy={y}
          r={r}
          fill="none"
          stroke="var(--color-accent-bright)"
          strokeWidth={1}
          initial={{ opacity: 0.6 }}
          animate={{
            cx: x,
            cy: y,
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            cx: { type: 'spring', stiffness: 140, damping: 18 },
            cy: { type: 'spring', stiffness: 140, damping: 18 },
            opacity: { duration: 1.8, repeat: Infinity, ease: 'easeOut' },
          }}
        />
      )}

      <motion.circle
        cx={x}
        cy={y}
        r={r}
        initial={{ opacity: 0, cx: x, cy: y, r: r * 0.4 }}
        animate={{ opacity: 1, cx: x, cy: y, r }}
        exit={{ opacity: 0, r: r * 0.4 }}
        fill={isFocus || treatment.filled ? treatment.fill : 'var(--color-bg-panel)'}
        stroke={treatment.stroke}
        strokeWidth={isFocus ? 0 : 1.2}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      />

      <motion.text
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x, y: y + r + 14 }}
        exit={{ opacity: 0 }}
        x={x}
        y={y + r + 14}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        className="select-none font-mono text-[10px] uppercase tracking-wide"
        fill={isFocus ? 'var(--color-text-primary)' : 'var(--color-text-muted)'}
      >
        {node.label.length > 16 ? `${node.label.slice(0, 15)}…` : node.label}
      </motion.text>
    </g>
  );
}