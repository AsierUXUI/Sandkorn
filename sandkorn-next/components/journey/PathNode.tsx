'use client'

import Link from 'next/link'
import type { JourneyNode, NodeState } from '@/types/journey'

interface PathNodeProps {
  node: JourneyNode
  state: NodeState
  companyId: string
  showConnector: boolean
  onTap: (node: JourneyNode) => void
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

export function PathNode({ node, state, companyId, showConnector, onTap }: PathNodeProps) {
  const isDone = state === 'completed'
  const isActive = state === 'active'
  const isHolding = state === 'holding'
  const isUpcoming = state === 'upcoming'
  const circleSize = node.isMilestone ? 'w-[72px] h-[72px]' : 'w-16 h-16'

  return (
    <div>
      {/* Centered node circle */}
      <div className="flex justify-center">
        <button
          onClick={() => onTap(node)}
          className={`${circleSize} rounded-full flex items-center justify-center flex-shrink-0 border-[3px] transition-all cursor-pointer ${
            isDone || isHolding
              ? 'bg-teal border-teal'
              : isActive
              ? 'bg-white border-teal shadow-[0_0_0_6px_rgba(26,122,106,0.12)]'
              : node.isMilestone
              ? 'bg-amber-bg border-amber-border opacity-40'
              : 'bg-border border-border2 opacity-40'
          }`}
          style={isActive ? { animation: 'journeyPulse 1.8s ease-in-out infinite' } : undefined}
          aria-label={node.label}
        >
          {isDone || isHolding ? (
            node.isMilestone ? (
              <span className="text-white"><FlagIcon /></span>
            ) : (
              <CheckIcon />
            )
          ) : isUpcoming && !node.isMilestone ? (
            <span className="text-dim"><LockIcon /></span>
          ) : (
            <span
              className="text-[28px] leading-none"
              style={isUpcoming ? { filter: 'grayscale(1)', opacity: 0.5 } : undefined}
            >
              {node.isMilestone ? '🏁' : (NODE_ICONS[node.type] ?? '⬡')}
            </span>
          )}
        </button>
      </div>

      {/* Card — hidden body for upcoming */}
      <button
        onClick={() => onTap(node)}
        className={`w-full mt-3 rounded-2xl text-left transition-all cursor-pointer ${
          isActive
            ? 'bg-teal border-2 border-teal shadow-[0_8px_32px_rgba(26,122,106,.18)] p-4'
            : isDone || isHolding
            ? 'bg-teal-bg border border-teal-border p-4'
            : node.isMilestone
            ? 'bg-amber-bg border border-amber-border p-4 opacity-40'
            : 'bg-white border border-border p-3 opacity-40'
        }`}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`font-mono text-[9px] tracking-[.5px] uppercase ${isActive ? 'text-white/60' : 'text-dim'}`}>
              {node.timing}
            </span>
            {node.isMilestone && (
              <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-full tracking-[.3px] ${
                isActive ? 'bg-white/20 text-white' : 'bg-amber-bg text-amber border border-amber-border'
              }`}>
                MILESTONE
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full tracking-[.4px] ${
              isDone || isHolding
                ? 'bg-teal text-white'
                : isActive
                ? 'bg-amber text-white'
                : 'bg-bg text-dim border border-border'
            }`}>
              +{node.grains} GR
            </span>
            {(isDone || isHolding) && (
              <span className="font-mono text-[9px] bg-white text-teal-2 border border-teal-border px-2 py-0.5 rounded-full">
                DONE ✓
              </span>
            )}
            {isActive && (
              <span className="font-mono text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full tracking-[.4px]">
                NOW
              </span>
            )}
            {isHolding && (
              <span className="font-mono text-[9px] bg-teal text-white px-2 py-0.5 rounded-full tracking-[.4px]">
                HOLDING
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-syne font-extrabold text-[17px] leading-tight mb-2 ${isActive ? 'text-white' : ''}`}>
          {node.label}
        </h3>

        {/* Body — hidden for upcoming */}
        {!isUpcoming && (
          <>
            <p className={`text-[12px] leading-relaxed mb-3 ${isActive ? 'text-white/80' : 'text-mid'}`}>
              {node.description}
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className={`text-[9px] tracking-[4px] ${isActive ? 'text-white/40' : 'text-teal/40'}`}>●●●●●</span>
              <span className={`font-caveat text-[13px] ${isActive ? 'text-white/60' : 'text-mid'}`}>
                {formatCount(node.socialCount)} people here
              </span>
            </div>

            {/* CTA — active only */}
            {isActive && node.actionLabel && node.actionHref && (
              <Link
                href={`/companies/${companyId}${node.actionHref}`}
                onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()}
                className="flex items-center justify-center w-full bg-white text-teal rounded-xl py-3.5 text-[13px] font-bold no-underline mt-1"
              >
                {node.actionLabel} →
              </Link>
            )}
          </>
        )}

        {/* Upcoming: just lock hint */}
        {isUpcoming && (
          <p className={`text-[11px] ${node.isMilestone ? 'text-amber/60' : 'text-dim'}`}>
            {node.description.split('.')[0]}.
          </p>
        )}
      </button>

      {/* Connector — centered vertical dashed line */}
      {showConnector && (
        <div className="flex justify-center py-1">
          <div
            className={`w-px h-8 ${isDone || isHolding ? 'bg-teal' : 'bg-border2'}`}
            style={{
              backgroundImage: isDone || isHolding
                ? undefined
                : 'repeating-linear-gradient(to bottom, #cdd0c8 0px, #cdd0c8 4px, transparent 4px, transparent 8px)',
              background: isDone || isHolding ? '#1a7a6a' : undefined,
            }}
          />
        </div>
      )}
    </div>
  )
}
