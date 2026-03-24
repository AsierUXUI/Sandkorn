'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { JOURNEY_PHASES, formatCount } from '@/lib/data/journey'
import type { JourneyPhaseKey } from '@/types/journey'

interface JourneyPathProps {
  companyId: string
  // Phase 0 demo state: grain auto-completed, cut active
  activeStep?: JourneyPhaseKey
  completedSteps?: JourneyPhaseKey[]
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function JourneyPath({
  companyId,
  activeStep = 'cut',
  completedSteps = ['grain'],
}: JourneyPathProps) {
  useEffect(() => {
    const el = document.getElementById(`journey-step-${activeStep}`)
    if (el) {
      // Small delay to let layout settle before scrolling
      const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200)
      return () => clearTimeout(t)
    }
  }, [activeStep])

  // Render in reverse: step 5 at DOM top (goal), step 1 at DOM bottom (start)
  const reversed = [...JOURNEY_PHASES].reverse()

  return (
    <div className="px-3.5 py-5">
      {reversed.map((phase, revIdx) => {
        const originalIdx = JOURNEY_PHASES.length - 1 - revIdx // 0=step1 … 4=step5
        const isRight = originalIdx % 2 === 0 // steps 1,3,5 right; 2,4 left
        const isDone = completedSteps.includes(phase.key)
        const isActive = phase.key === activeStep
        const isLast = revIdx === reversed.length - 1

        return (
          <div key={phase.key} id={`journey-step-${phase.key}`}>
            {/* Node — floated left or right */}
            <div className={`flex ${isRight ? 'justify-end pr-5' : 'justify-start pl-5'}`}>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-[3px] transition-all ${
                  isDone
                    ? 'bg-teal border-teal'
                    : isActive
                    ? 'bg-white border-teal'
                    : 'bg-border border-border2 opacity-60'
                }`}
                style={isActive ? { animation: 'journeyPulse 1.8s ease-in-out infinite' } : undefined}
              >
                {isDone ? (
                  <CheckIcon />
                ) : (
                  <span
                    className="text-[26px] leading-none"
                    style={!isActive ? { filter: 'grayscale(1)', opacity: 0.5 } : undefined}
                  >
                    {phase.icon}
                  </span>
                )}
              </div>
            </div>

            {/* Card */}
            <div
              className={`mt-2.5 rounded-2xl bg-white p-4 ${
                isActive
                  ? 'border-2 border-teal shadow-[0_4px_20px_rgba(26,122,106,.12)]'
                  : isDone
                  ? 'border border-teal-border'
                  : 'border border-border opacity-70'
              }`}
            >
              {/* Meta row */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] text-dim tracking-[.5px]">{phase.label}</span>
                  <span className="text-border2 text-[11px]">·</span>
                  <span className="font-mono text-[9px] text-dim">{phase.week}</span>
                </div>
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
              </div>

              {/* Title */}
              <h3 className="font-syne font-extrabold text-[16px] mb-1 leading-tight">{phase.title}</h3>

              {/* Body */}
              <p className="text-[12px] text-mid leading-relaxed mb-2">
                {phase.description.split('.')[0]}.
              </p>

              {/* Social proof */}
              <div className={`flex items-center gap-1.5 ${isActive && phase.actionLabel ? 'mb-2.5' : ''}`}>
                <span className="text-[10px] tracking-[3px] text-teal opacity-60">●●●●●</span>
                <span className="text-[11px] text-dim">{formatCount(phase.mockCount)} people on this step</span>
              </div>

              {/* CTA */}
              {isActive && phase.actionLabel && (
                <Link
                  href={`/companies/${companyId}${phase.actionHref ?? '/'}`}
                  className="flex items-center justify-center w-full bg-teal text-white rounded-xl py-3 text-[13px] font-semibold no-underline mt-0.5"
                >
                  {phase.actionLabel}
                </Link>
              )}
              {isActive && !phase.actionLabel && (
                <button className="w-full bg-transparent border border-border rounded-xl py-2.5 text-[12px] text-mid cursor-pointer mt-0.5">
                  What happens here? →
                </button>
              )}
            </div>

            {/* Connector to the step below */}
            {!isLast && (
              <div
                className={`h-10 flex items-center ${
                  isRight ? 'justify-end pr-12' : 'justify-start pl-12'
                }`}
              >
                <div
                  className={`w-0.5 h-9 rounded-full ${isDone ? 'bg-teal' : 'bg-border2'}`}
                  style={{ transform: `rotate(${isRight ? '-22deg' : '22deg'})` }}
                />
              </div>
            )}
          </div>
        )
      })}

      {/* Bottom label */}
      <p className="font-mono text-[9px] text-dim text-center tracking-[1px] mt-8 mb-2">
        START HERE · YOUR GRAIN WAS PLANTED
      </p>
    </div>
  )
}
