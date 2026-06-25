'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { WorkspaceNode, WorkspaceEdge } from '@/data/workspaceData';
import { useRouter } from 'next/navigation';

interface SimNode extends WorkspaceNode, d3.SimulationNodeDatum {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimLink {
  source: SimNode;
  target: SimNode;
  label?: string;
}

interface NetworkGraphProps {
  nodes: WorkspaceNode[];
  edges: WorkspaceEdge[];
  onReady?: () => void;
  reduceMotion?: boolean;
  isEngaged?: boolean;
  onEngage?: () => void;
}

const NODE_CONFIG: Record<WorkspaceNode['type'], { radius: number; color: string; labelColor: string }> = {
  pillar:      { radius: 22, color: '#10b981', labelColor: '#34d399' },
  project:     { radius: 14, color: '#1c1c1c', labelColor: '#f5f5f7' },
  technology:  { radius: 8,  color: '#111111', labelColor: '#86868b' },
  concept:     { radius: 9,  color: '#111111', labelColor: '#86868b' },
  experience:  { radius: 10, color: '#111111', labelColor: '#86868b' },
};

export default function NetworkGraph({
  nodes,
  edges,
  onReady,
  reduceMotion = false,
  isEngaged = false,
  onEngage,
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<WorkspaceNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const readyRef = useRef(false);
  const router = useRouter();

  const handleNodeClick = useCallback((node: SimNode) => {
    if (node.url) router.push(node.url);
  }, [router]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    readyRef.current = false;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('cursor', isEngaged ? 'grab' : 'pointer')
      .on('click', (event) => {
        if (event.target === svgRef.current) onEngage?.();
      });

    // Defs: glow filter
    const defs = svg.append('defs');
    const glowFilter = defs.append('filter').attr('id', 'glow');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Clone nodes to avoid mutating original data
    const simNodes: SimNode[] = nodes.map(n => ({ ...n }));
    const nodeById = new Map(simNodes.map(n => [n.id, n]));

    const simLinks: SimLink[] = edges
      .map(e => {
        const source = nodeById.get(e.source);
        const target = nodeById.get(e.target);
        if (!source || !target) return null;
        return { source, target, label: e.label };
      })
      .filter(Boolean) as SimLink[];

    const heroExclusionForce: d3.Force<SimNode, SimLink> = (alpha: number) => {
      if (isEngaged || reduceMotion) return;

      const left = width * 0.24;
      const right = width * 0.76;
      const top = height * 0.28;
      const bottom = height * 0.72;

      simNodes.forEach((node) => {
        if (node.x == null || node.y == null) return;
        if (node.x <= left || node.x >= right || node.y <= top || node.y >= bottom) return;

        const distances = [
          { axis: 'x' as const, direction: -1, value: node.x - left },
          { axis: 'x' as const, direction: 1, value: right - node.x },
          { axis: 'y' as const, direction: -1, value: node.y - top },
          { axis: 'y' as const, direction: 1, value: bottom - node.y },
        ].sort((a, b) => a.value - b.value);
        const nearestExit = distances[0];
        const strength = node.type === 'pillar' || node.type === 'project' ? 18 : 11;

        if (nearestExit.axis === 'x') {
          node.vx = (node.vx ?? 0) + nearestExit.direction * strength * alpha;
        } else {
          node.vy = (node.vy ?? 0) + nearestExit.direction * strength * alpha;
        }
      });
    };
    heroExclusionForce.initialize = () => {};

    // Simulation — intentionally slow and gentle
    const simulation = d3.forceSimulation<SimNode>(simNodes)
      .force('link', d3.forceLink<SimNode, SimLink>(simLinks)
        .id(d => d.id)
        .distance(d => {
          const s = d.source as SimNode;
          const t = d.target as SimNode;
          if (s.type === 'pillar' || t.type === 'pillar') return 130;
          if (s.type === 'project' || t.type === 'project') return 90;
          return 65;
        })
        .strength(0.4))
      .force('charge', d3.forceManyBody().strength(d => {
        const n = d as SimNode;
        if (n.type === 'pillar') return -400;
        if (n.type === 'project') return -200;
        return -80;
      }))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('heroExclusion', heroExclusionForce)
      .force('collision', d3.forceCollide<SimNode>(d => {
        const n = d as SimNode;
        return NODE_CONFIG[n.type].radius + 18;
      }))
      .alphaDecay(reduceMotion ? 0.9 : 0.012)
      .velocityDecay(reduceMotion ? 0.9 : 0.55);

    simulationRef.current = simulation;

    // Zoom + pan
    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .filter((event) => {
        if (!isEngaged) return false;
        if (event.type === 'dblclick') return false;
        return !event.ctrlKey || event.type === 'wheel';
      })
      .on('start', () => svg.attr('cursor', 'grabbing'))
      .on('end', () => svg.attr('cursor', isEngaged ? 'grab' : 'pointer'))
      .on('zoom', (event) => { g.attr('transform', event.transform); });
    svg.call(zoom);

    const initialScale = width >= 1024 ? 1.42 : 1.1;
    const initialTransform = d3.zoomIdentity
      .translate((width - width * initialScale) / 2, (height - height * initialScale) / 2)
      .scale(initialScale);
    svg.call(zoom.transform, initialTransform);

    // Links
    const link = g.append('g').attr('class', 'links')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', '#1c1c1c')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.6);

    // Node groups
    const node = g.append('g').attr('class', 'nodes')
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .attr('cursor', d => d.url ? 'pointer' : 'default')
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltipPos({ x: event.clientX - rect.left + 12, y: event.clientY - rect.top - 40 });
        d3.select(event.currentTarget).select('circle')
          .transition().duration(200)
          .attr('r', NODE_CONFIG[d.type].radius * 1.35)
          .attr('stroke', '#10b981')
          .attr('stroke-opacity', 0.9);
      })
      .on('mousemove', (event) => {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltipPos({ x: event.clientX - rect.left + 12, y: event.clientY - rect.top - 40 });
      })
      .on('mouseleave', (event, d) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).select('circle')
          .transition().duration(200)
          .attr('r', NODE_CONFIG[d.type].radius)
          .attr('stroke', d.type === 'pillar' ? '#10b981' : '#1c1c1c')
          .attr('stroke-opacity', d.type === 'pillar' ? 0.8 : 0.5);
      })
      .on('click', (_, d) => handleNodeClick(d))
      .call(
        d3.drag<SVGGElement, SimNode>()
          .filter(() => isEngaged)
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.15).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          }) as never
      );

    // Circle per node
    node.append('circle')
      .attr('r', d => NODE_CONFIG[d.type].radius)
      .attr('fill', d => {
        if (d.type === 'pillar') return 'rgba(16,185,129,0.12)';
        if (d.type === 'project') return 'rgba(22,22,22,0.9)';
        return 'rgba(13,13,13,0.9)';
      })
      .attr('stroke', d => d.type === 'pillar' ? '#10b981' : '#1c1c1c')
      .attr('stroke-width', d => d.type === 'pillar' ? 1.5 : 1)
      .attr('stroke-opacity', d => d.type === 'pillar' ? 0.8 : 0.5)
      .attr('filter', d => d.type === 'pillar' ? 'url(#glow)' : '');

    // Labels
    node.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', d => NODE_CONFIG[d.type].radius + 11)
      .attr('font-size', d => {
        if (d.type === 'pillar') return '11px';
        if (d.type === 'project') return '9px';
        return '7.5px';
      })
      .attr('font-family', 'var(--font-geist-mono), monospace')
      .attr('fill', d => NODE_CONFIG[d.type].labelColor)
      .attr('pointer-events', 'none')
      .attr('opacity', d => (d.type === 'technology' || d.type === 'concept') ? 0.5 : 0.85);

    // Tick
    simulation.on('tick', () => {
      if (!readyRef.current) {
        readyRef.current = true;
        onReady?.();
        if (reduceMotion) simulation.stop();
      }

      link
        .attr('x1', d => (d.source as SimNode).x!)
        .attr('y1', d => (d.source as SimNode).y!)
        .attr('x2', d => (d.target as SimNode).x!)
        .attr('y2', d => (d.target as SimNode).y!);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Resize observer
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      svg.attr('width', w).attr('height', h);
      simulation.force('center', d3.forceCenter(w / 2, h / 2));
      simulation.alpha(0.2).restart();
    });
    ro.observe(container);

    return () => {
      simulation.stop();
      ro.disconnect();
    };
  }, [nodes, edges, handleNodeClick, onReady, reduceMotion, isEngaged, onEngage]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="pointer-events-none absolute z-20 max-w-xs p-3 rounded-lg bg-bg-panel/95 border border-border-muted backdrop-blur-md shadow-xl"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
              hoveredNode.type === 'pillar' ? 'bg-accent/20 text-accent' :
              hoveredNode.type === 'project' ? 'bg-border-muted text-text-secondary' :
              'bg-bg-dark text-text-muted'
            }`}>
              {hoveredNode.type}
            </span>
            {hoveredNode.url && (
              <span className="text-[9px] font-mono text-accent opacity-60">→ click to open</span>
            )}
          </div>
          <p className="text-sm font-semibold text-text-primary">{hoveredNode.label}</p>
          {hoveredNode.description && (
            <p className="text-[11px] text-text-secondary mt-1 leading-relaxed line-clamp-2">
              {hoveredNode.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
