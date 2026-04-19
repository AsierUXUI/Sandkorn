'use client'

import Link from 'next/link'
import type { JourneyNode, NodeState } from '@/types/journey'

interface PathNodeProps {
  node: JourneyNode
  state: NodeState
  side: 'left' | 'right'
  companyId: string
  showConnector: boolean
  onTap: (node: JourneyNode) => void
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function MilestoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k'
  return String(n)
}

const NODE_ICONS: Record<string, string> = {
  share: '📣',
  delete_app: '✂️',
  find_alternative: '🔄',
  hold: '🌱',
  send_gdpr: '📄',
  read_finding: '🔍',
  custom: '⬡',
}

export function PathNode({ node, state, side, companyId, showConnector, onTap }: PathNodeProps) {
  const isDone = state === 'completed'
  const isActive = state === 'active'
  const isHolding = state === 'holding'
  const isUpcoming = state === 'upcoming'

  const isRight = side === 'right'

  return (
    <div>
      {/* Node circle */}
      <div className={`flex ${isRight ? 'justify-end pr-5' : 'justify-start pl-5'}`}>
        <button
          onClick={() => onTap(node)}
          className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-[3px] transition-all cursor-pointer ${
            isDone || isHolding
              ? 'bg-teal border-teal'
              : isActive
              ? 'bg-white border-teal'
              : 'bg-border border-border2 opacity-50'
          }`}
          style={isActive ? { animation: 'journeyPulse 1.8s ease-in-out infinite' } : undefined}
          aria-label={node.label}
        >
          {isDone || isHolding ? (
            node.isMilestone ? (
              <span className="text-white"><MilestoneIcon /></span>
            ) : (
              <CheckIcon />
            )
          ) : (
            <span
              className="text-[26px] leading-none"
              style={isUpcoming ? { filter: 'grayscale(1)', opacity: 0.4 } : undefined}
            >
              {NODE_ICONS[node.type] ?? '⬡'}
            </span>
          )}
        </button>
      </div>

      {/* Card */}
      <button
        onClick={() => onTap(node)}
        className={`w-full mt-2.5 rounded-2xl bg-white p-4 text-left transition-all cursor-pointer ${
          isActive
            ? 'border-2 border-teal shadow-[0_4px_20px_rgba(26,122,106,.12)]'
            : isDone || isHolding
            ? 'border border-teal-border'
            : 'border border-border opacity-60'
        } ${node.isMilestone && (isDone || isHolding) ? 'border-sand border-2' : ''}`}
      >
        {/* Meta row */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-dim tracking-[.5px] uppercase">{node.timing}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Grain pill */}
            <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full tracking-[.4px] ${
              isDone || isHolding
                ? 'bg-teal-bg text-teal-2 border border-teal-border'
                : isActive
                ? 'bg-amber-bg text-amber border border-amber-border'
                : 'bg-bg text-dim border border-border'
            }`}>
              +{node.grains} GR
            </span>
            {/* State badge */}
            {isDone && (
              <span className="font-mono text-[9px] bg-teal-bg text-teal-2 border border-teal-border px-2 py-0.5 rounded-full">
                DONE ✓
              </span>
            )}
            {isActive && (
              <span className="font-mono text-[9px] bg-text text-white px-2 py-0.5 rounded-full tracking-[.4px]">
                NOW
              </span>
            )}
            {isHolding && (
              <span className="font-mono text-[9px] bg-teal text-white px-2 py-0.5 rounded-full tracking-[.4px]">
                HOLDING
              </span>
            )}
            {node.isMilestone && (
              <span className="font-mono text-[9px] bg-amber-bg text-amber border border-amber-border px-2 py-0.5 rounded-full">
                MILESTONE
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-syne font-extrabold text-[16px] mb-1 leading-tight">{node.label}</h3>

        {/* Description — truncated for upcoming */}
        <p className="text-[12px] text-mid leading-relaxed mb-2">
          {isUpcoming
            ? node.description.split('.')[0] + '.'
            : node.description}
        </p>

        {/* Social proof */}
        <div className={`flex items-center gap-1.5 ${isActive && node.actionLabel ? 'mb-2.5' : ''}`}>
          <span className="text-[10px] tracking-[3px] text-teal opacity-60">●●●●●</span>
          <span className="text-[11px] text-dim">{formatCount(node.socialCount)} people here</span>
        </div>

        {/* CTA — active only */}
        {isActive && node.actionLabel && node.actionHref && (
          <Link
            href={`/companies/${companyId}${node.actionHref}`}
            onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()}
            className="flex items-center justify-center w-full bg-teal text-white rounded-xl py-3 text-[13px] font-semibold no-underline mt-0.5"
          >
            {node.actionLabel}
          </Link>
        )}
      </button>

      {/* Connector */}
      {showConnector && (
        <div className={`h-10 flex items-center ${isRight ? 'justify-end pr-12' : 'justify-start pl-12'}`}>
          <div
            className={`w-0.5 h-9 rounded-full ${isDone || isHolding ? 'bg-teal' : 'bg-border2'}`}
            style={{ transform: `rotate(${isRight ? '-22deg' : '22deg'})` }}
          />
        </div>
      )}
    </div>
  )
}
