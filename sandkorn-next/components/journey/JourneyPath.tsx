'use client'

import { useEffect, useState } from 'react'
import { PathNode } from './PathNode'
import { NodeSheet } from './NodeSheet'
import type { JourneyConfig, JourneyNode, NodeState } from '@/types/journey'

interface JourneyPathProps {
  config: JourneyConfig
  activeNodeId: string
  completedNodeIds: string[]
}

export function JourneyPath({ config, activeNodeId, completedNodeIds }: JourneyPathProps) {
  const [selectedNode, setSelectedNode] = useState<JourneyNode | null>(null)

  // Auto-scroll to active node on mount
  useEffect(() => {
    const el = document.getElementById(`journey-node-${activeNodeId}`)
    if (el) {
      const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200)
      return () => clearTimeout(t)
    }
  }, [activeNodeId])

  const allDone = config.nodes.every((n) => completedNodeIds.includes(n.id))

  function getState(nodeId: string): NodeState {
    if (completedNodeIds.includes(nodeId)) return allDone ? 'holding' : 'completed'
    if (nodeId === activeNodeId) return 'active'
    return 'upcoming'
  }

  return (
    <>
      <div className="px-3.5 py-5">
        {config.nodes.map((node, idx) => (
          <div key={node.id} id={`journey-node-${node.id}`}>
            <PathNode
              node={node}
              state={getState(node.id)}
              companyId={config.companyId}
              showConnector={idx < config.nodes.length - 1}
              onTap={setSelectedNode}
            />
          </div>
        ))}

        {allDone && (
          <div className="mt-4 bg-teal-bg border border-teal-border rounded-2xl px-4 py-4 text-center">
            <p className="font-syne font-extrabold text-[15px] text-teal-2 mb-1">You're holding the line</p>
            <p className="text-[12px] text-mid">All steps done. The boycott ends when the time is up — your badge is waiting.</p>
          </div>
        )}

        <p className="font-mono text-[9px] text-dim text-center tracking-[1px] mt-8 mb-2">
          START HERE · YOUR GRAIN WAS PLANTED
        </p>
      </div>

      {selectedNode && (
        <NodeSheet
          node={selectedNode}
          state={getState(selectedNode.id)}
          companyId={config.companyId}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </>
  )
}
