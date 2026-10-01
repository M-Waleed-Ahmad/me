'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceNode } from '@/data/workspaceData';
import { LaidOutEdge, LaidOutNode, useNeighborhoodGraph } from './useNeighborhoodGraph';

const VIEWBOX_WIDTH = 560;
const VIEWBOX_HEIGHT = 360;

const nodeTreatment: Record<
  WorkspaceNode['type'],
  { fill: string; stroke: string; text: string; initial: string; labelTone: string }
> = {
  pillar: { fill: 'var(--color-accent)', stroke: 'var(--color-accent-ink)', text: 'var(--color-paper)', initial: 'P', labelTone: 'var(--color-ink)' },
  project: { fill: 'var(--color-surface)', stroke: 'var(--color-accent)', text: 'var(--color-accent-ink)', initial: 'PR', labelTone: 'var(--color-ink)' },
  technology: { fill: 'var(--color-surface)', stroke: 'var(--color-ink-2)', text: 'var(--color-ink)', initial: 'T', labelTone: 'var(--color-ink-2)' },
  concept: { fill: 'var(--color-surface)', stroke: 'var(--color-rule-strong)', text: 'var(--color-accent-ink)', initial: 'C', labelTone: 'var(--color-ink-2)' },
  experience: { fill: 'var(--color-surface)', stroke: 'var(--color-ink-2)', text: 'var(--color-ink)', initial: 'E', labelTone: 'var(--color-ink-2)' },
};

interface GraphPreviewProps {
  focusId: string;
  onSelect: (id: string) => void;
}

export function GraphPreview({ focusId, onSelect }: GraphPreviewProps) {
  const { laidOutNodes, laidOutEdges, width, height } = useNeighborhoodGraph(focusId);

  return (
    <div className="relative bg-surface" style={{ aspectRatio: `${width} / ${height}` }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        role="img"
        aria-label={`Graph of connections around ${focusId}`}
        style={{ display: 'block' }}
      >
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" opacity={0.06} />

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
      stroke={isFocusEdge ? 'var(--color-accent)' : 'var(--color-rule-strong)'}
      strokeOpacity={isFocusEdge ? 0.55 : 0.65}
      strokeWidth={isFocusEdge ? 1.4 : 1}
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
  const displayLabel = node.label.length > 22 ? `${node.label.slice(0, 21)}…` : node.label;
  const labelWidth = Math.min(132, Math.max(58, displayLabel.length * 6.8 + 18));
  const labelHeight = 22;
  const dx = x - VIEWBOX_WIDTH / 2;
  const dy = y - VIEWBOX_HEIGHT / 2;
  const placeOnSide = !isFocus && Math.abs(dx) > Math.abs(dy) * 0.72;
  const labelCenterTargetX = isFocus
    ? x
    : placeOnSide
      ? x + Math.sign(dx || 1) * (r + labelWidth / 2 + 12)
      : x;
  const labelCenterTargetY = isFocus
    ? y + r + labelHeight / 2 + 9
    : placeOnSide
      ? y
      : y + Math.sign(dy || 1) * (r + labelHeight / 2 + 10);
  const labelX = Math.max(8, Math.min(labelCenterTargetX - labelWidth / 2, VIEWBOX_WIDTH - labelWidth - 8));
  const labelY = Math.max(8, Math.min(labelCenterTargetY - labelHeight / 2, VIEWBOX_HEIGHT - labelHeight - 8));
  const labelCenterX = labelX + labelWidth / 2;
  const labelCenterY = labelY + labelHeight / 2 + 1;

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
          r={r + 8}
          fill="none"
          stroke="var(--color-accent-ink)"
          strokeWidth={1}
          initial={{ opacity: 0.6, cx: x, cy: y }}
          animate={{
            cx: x,
            cy: y,
            opacity: [0.55, 0.15, 0.55],
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
        fill={treatment.fill}
        stroke={treatment.stroke}
        strokeWidth={isFocus ? 2 : 1.5}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      />

      {!isFocus && (
        <motion.circle
          cx={x}
          cy={y}
          r={Math.max(4, r - 8)}
          initial={{ opacity: 0, cx: x, cy: y }}
          animate={{ opacity: 0.16, cx: x, cy: y }}
          exit={{ opacity: 0 }}
          fill={treatment.stroke}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        />
      )}

      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none font-mono text-[10px] font-semibold"
        fill={treatment.text}
        pointerEvents="none"
      >
        {treatment.initial}
      </text>

      <text
        x={labelCenterX}
        y={labelCenterY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none font-serif text-[14px]"
        fill="none"
        stroke="var(--color-surface)"
        strokeWidth={5}
        strokeLinejoin="round"
        pointerEvents="none"
      >
        {displayLabel}
      </text>
      <text
        x={labelCenterX}
        y={labelCenterY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none font-serif text-[14px]"
        fill={isFocus ? 'var(--color-ink)' : treatment.labelTone}
        pointerEvents="none"
      >
        {displayLabel}
      </text>
      <title>{node.label}</title>
    </g>
  );
}
