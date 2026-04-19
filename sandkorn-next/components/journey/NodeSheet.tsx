'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import type { JourneyNode, NodeState } from '@/types/journey'

interface NodeSheetProps {
  node: JourneyNode
  state: NodeState
  companyId: string
  onClose: () => void
}

const STATE_LABELS: Record<NodeState, string> = {
  completed: 'Completed',
  active: 'Up now',
  upcoming: 'Coming up',
  holding: 'Holding',
}

const STATE_COPY: Record<NodeState, string> = {
  completed: "You did this. It's in the pile.",
  active: "This is your next step. Do it when you're ready.",
  upcoming: "You'll reach this once the steps above are done.",
  holding: "You've held the line here. Keep going.",
}

export function NodeSheet({ node, state, companyId, onClose }: NodeSheetProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[201] max-w-[430px] mx-auto bg-bg rounded-t-3xl px-5 pt-5 pb-10 shadow-[0_-8px_40px_rgba(0,0,0,.15)]">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-border2 rounded-full mx-auto mb-5" />

        {/* State label */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`font-mono text-[9px] px-2.5 py-1 rounded-full tracking-[.5px] ${
            state === 'completed' || state === 'holding'
              ? 'bg-teal-bg text-teal-2 border border-teal-border'
              : state === 'active'
              ? 'bg-text text-white'
              : 'bg-bg text-dim border border-border'
          }`}>
            {STATE_LABELS[state].toUpperCase()}
          </span>
          <span className="font-mono text-[9px] text-dim tracking-[.4px]">{node.timing}</span>
          <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full ml-auto ${
            state === 'completed' || state === 'holding'
              ? 'bg-teal-bg text-teal-2 border border-teal-border'
              : 'bg-amber-bg text-amber border border-amber-border'
          }`}>
            +{node.grains} GRAINS
          </span>
        </div>

        {/* Title */}
        <h2 className="font-syne font-extrabold text-[22px] leading-tight mb-1">{node.label}</h2>

        {/* State copy */}
        <p className="font-caveat text-[15px] text-teal mb-3">{STATE_COPY[state]}</p>

        {/* Full description */}
        <p className="text-[13px] text-mid leading-relaxed mb-5">{node.description}</p>

        {/* Social proof */}
        <div className="flex items-center gap-2 bg-teal-bg border border-teal-border rounded-xl px-4 py-3 mb-5">
          <span className="text-[12px] tracking-[4px] text-teal opacity-70">●●●●●</span>
          <p className="text-[12px] text-mid">
            <span className="font-semibold text-text">
              {node.socialCount >= 1000
                ? (node.socialCount / 1000).toFixed(1).replace('.0', '') + 'k'
                : node.socialCount} people
            </span>
            {' '}have completed this step
          </p>
        </div>

        {/* CTA */}
        {state === 'active' && node.actionLabel && node.actionHref ? (
          <Link
            href={`/companies/${companyId}${node.actionHref}`}
            className="flex items-center justify-center w-full bg-teal text-white rounded-xl py-3.5 text-[14px] font-semibold no-underline"
          >
            {node.actionLabel}
          </Link>
        ) : state === 'active' ? (
          <button
            onClick={onClose}
            className="w-full bg-text text-white rounded-xl py-3.5 text-[14px] font-semibold cursor-pointer"
          >
            Got it — I'll do this
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full bg-transparent border border-border rounded-xl py-3 text-[13px] text-mid cursor-pointer"
          >
            Close
          </button>
        )}
      </div>
    </>
  )
}
