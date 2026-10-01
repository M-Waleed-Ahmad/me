'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceCenter,
  Simulation,
} from 'd3';
import { workspaceEdges, workspaceNodes, WorkspaceNode } from '@/data/workspaceData';

export type LaidOutNode = {
  node: WorkspaceNode;
  x: number;
  y: number;
  r: number;
  isFocus: boolean;
  connectionCount: number;
};

export type LaidOutEdge = {
  source: LaidOutNode;
  target: LaidOutNode;
  id: string;
};

type SimNode = {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

type SimLink = {
  source: string;
  target: string;
};

const WIDTH = 560;
const HEIGHT = 360;
// Keep every node's center at least this far from each viewBox edge —
// must exceed the largest node radius (26) plus its label height (~18px)
// so labels never clip the bottom edge either.
const MARGIN = 56;

/**
 * Count total edges touching each node, once, up front.
 * Sizing by total-graph connectivity (not neighborhood-local connectivity)
 * keeps a node's size stable as you click around — e.g. 'postgresql' stays
 * the same size whether you're focused on it directly or arrived at it
 * via 'arabia-hills'.
 */
function useConnectionCounts() {
  return useMemo(() => {
    const counts = new Map<string, number>();
    for (const edge of workspaceEdges) {
      counts.set(edge.source, (counts.get(edge.source) ?? 0) + 1);
      counts.set(edge.target, (counts.get(edge.target) ?? 0) + 1);
    }
    return counts;
  }, []);
}

/**
 * Builds the neighborhood (focus node + direct neighbors) for a given node id.
 * In this dataset, pillar nodes (products/systems/intelligence) fan out to
 * 3-4 projects, and project nodes fan out to 2-4 technologies/concepts —
 * so most neighborhoods land in the 4-7 node range the force layout is tuned for.
 */
function useNeighborhood(focusId: string) {
  return useMemo(() => {
    const neighborIds = new Set<string>([focusId]);
    const links: SimLink[] = [];

    for (const edge of workspaceEdges) {
      if (edge.source === focusId || edge.target === focusId) {
        neighborIds.add(edge.source);
        neighborIds.add(edge.target);
        links.push({ source: edge.source, target: edge.target });
      }
    }

    const nodes = workspaceNodes.filter((n) => neighborIds.has(n.id));
    return { nodes, links };
  }, [focusId]);
}

/**
 * Runs a force simulation scoped to a node's immediate neighborhood only.
 * Re-running on every selection change (rather than maintaining one global
 * simulation) is the point: the graph should re-settle, not just re-style.
 */
export function useNeighborhoodGraph(focusId: string) {
  const connectionCounts = useConnectionCounts();
  const { nodes, links } = useNeighborhood(focusId);

  const [laidOutNodes, setLaidOutNodes] = useState<LaidOutNode[]>([]);
  const [laidOutEdges, setLaidOutEdges] = useState<LaidOutEdge[]>([]);
  const simRef = useRef<Simulation<SimNode, undefined> | null>(null);

  useEffect(() => {
    simRef.current?.stop();

    // Place non-focus nodes on a ring sized to the neighborhood count, so a
    // 6-node fan-out starts wider than a 3-node one instead of always using
    // the same radius and relying on charge/collide to sort it out.
    const others = nodes.filter((n) => n.id !== focusId);
    const ringRadius = Math.min(175, 92 + others.length * 14);

    const simNodes: SimNode[] = nodes.map((n) => {
      if (n.id === focusId) {
        return { id: n.id, x: WIDTH / 2, y: HEIGHT / 2, fx: WIDTH / 2, fy: HEIGHT / 2 };
      }
      const i = others.findIndex((o) => o.id === n.id);
      const angle = (i / Math.max(others.length, 1)) * Math.PI * 2;
      return {
        id: n.id,
        x: WIDTH / 2 + Math.cos(angle) * ringRadius,
        y: HEIGHT / 2 + Math.sin(angle) * ringRadius,
        fx: null,
        fy: null,
      };
    });

    // forceLink replaces source/target ids with node objects in place, so give it
    // copies and keep `links` (plain ids) for building the rendered edges.
    const simLinks: SimLink[] = links.map((l) => ({ ...l }));

    const sizeFor = (id: string) => {
      const count = connectionCounts.get(id) ?? 1;
      return Math.min(26, 12 + count * 2);
    };

    const sim = forceSimulation(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(138)
          .strength(0.38)
      )
      .force('charge', forceManyBody().strength(-360))
      .force(
        'collide',
        forceCollide<SimNode>((d) => sizeFor(d.id) + 34)
      )
      .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
      .alpha(1)
      .alphaDecay(0.05);

    simRef.current = sim;

    sim.on('tick', () => {
      // Hard clamp every node inside the safe area after each tick. Charge
      // and collide forces can push nodes past the viewBox edge, especially
      // with only a handful of nodes in the simulation — clamping (rather
      // than a softer boundary force) guarantees nothing ever renders
      // outside the visible 560x360 area, even mid-settle.
      for (const sn of simNodes) {
        if (sn.fx == null) {
          sn.x = Math.max(MARGIN, Math.min(WIDTH - MARGIN, sn.x));
          sn.y = Math.max(MARGIN, Math.min(HEIGHT - MARGIN, sn.y));
        }
      }

      const nodeMap = new Map(simNodes.map((sn) => [sn.id, sn]));

      setLaidOutNodes(
        nodes.map((n) => {
          const sn = nodeMap.get(n.id)!;
          return {
            node: n,
            x: sn.x,
            y: sn.y,
            r: sizeFor(n.id),
            isFocus: n.id === focusId,
            connectionCount: connectionCounts.get(n.id) ?? 0,
          };
        })
      );

      setLaidOutEdges(
        links.map((l, i) => {
          const sourceNode = nodeMap.get(l.source)!;
          const targetNode = nodeMap.get(l.target)!;
          const sourceMeta = nodes.find((n) => n.id === l.source)!;
          const targetMeta = nodes.find((n) => n.id === l.target)!;
          return {
            id: `${l.source}-${l.target}-${i}`,
            source: {
              node: sourceMeta,
              x: sourceNode.x,
              y: sourceNode.y,
              r: sizeFor(sourceMeta.id),
              isFocus: sourceMeta.id === focusId,
              connectionCount: connectionCounts.get(sourceMeta.id) ?? 0,
            },
            target: {
              node: targetMeta,
              x: targetNode.x,
              y: targetNode.y,
              r: sizeFor(targetMeta.id),
              isFocus: targetMeta.id === focusId,
              connectionCount: connectionCounts.get(targetMeta.id) ?? 0,
            },
          };
        })
      );
    });

    return () => {
      sim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId, nodes, links]);

  return { laidOutNodes, laidOutEdges, width: WIDTH, height: HEIGHT };
}
