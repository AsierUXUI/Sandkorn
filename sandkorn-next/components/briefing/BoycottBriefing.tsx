'use client'

import { useState, useCallback } from 'react'
import type { BoycottBriefing as BoycottBriefingType } from '@/lib/data/briefings'

interface BoycottBriefingProps {
  briefing: BoycottBriefingType
  onComplete: () => void
  onDismiss: () => void
  skipBehavior: 'last-slide' | 'dismiss'
}

export function BoycottBriefing({ briefing, onComplete, onDismiss, skipBehavior }: BoycottBriefingProps) {
  const [index, setIndex] = useState(0)
  const beats = briefing.beats
  const beat = beats[index]
  const isLast = index === beats.length - 1

  const next = useCallback(() => {
    if (isLast) {
      onComplete()
    } else {
      setIndex((i) => i + 1)
    }
  }, [isLast, onComplete])

  const prev = useCallback(() => {
    if (index > 0) setIndex((i) => i - 1)
  }, [index])

  const handleSkip = useCallback(() => {
    if (skipBehavior === 'last-slide') {
      setIndex(beats.length - 1)
    } else {
      onDismiss()
    }
  }, [skipBehavior, beats.length, onDismiss])

  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      if (x < rect.width * 0.35) {
        prev()
      } else {
        next()
      }
    },
    [prev, next]
  )

  return (
    <div className="fixed inset-0 z-[500] flex flex-col bg-text" style={{ maxWidth: 430, margin: '0 auto' }}>
      {/* Progress bar */}
      <div className="flex gap-1 px-4 pt-[env(safe-area-inset-top,12px)] pt-3 pb-1 flex-shrink-0">
        {beats.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: i <= index ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Top controls */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0">
        <button
          onClick={index > 0 ? prev : onDismiss}
          className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white transition-colors"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <span className="font-mono text-[9px] text-white/40 tracking-[1px]">
          {index + 1} / {beats.length}
        </span>

        <button
          onClick={handleSkip}
          className="font-mono text-[10px] text-white/50 hover:text-white/80 tracking-[.5px] transition-colors"
        >
          SKIP
        </button>
      </div>

      {/* Tap zones + content */}
      <div
        className="flex-1 flex flex-col justify-center px-6 pb-24 cursor-pointer select-none"
        onClick={handleTap}
      >
        <div className="mb-6">
          <p className="font-mono text-[9px] text-white/30 tracking-[2px] mb-4 uppercase">
            Briefing · {index + 1} of {beats.length}
          </p>
          <h2 className="font-syne font-extrabold text-[28px] leading-[1.15] text-white mb-5">
            {beat.headline}
          </h2>
          <p className="text-[15px] leading-relaxed text-white/75">
            {beat.body}
          </p>
        </div>

        {beat.source && (
          <p className="font-mono text-[9px] text-white/25 tracking-[.5px]">
            SOURCE: {beat.source}
          </p>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-[calc(24px+env(safe-area-inset-bottom,0px))] flex-shrink-0">
        {isLast ? (
          <button
            onClick={onComplete}
            className="w-full bg-sand text-white rounded-2xl py-4 font-syne font-extrabold text-[16px] tracking-[.3px]"
          >
            Check my first step →
          </button>
        ) : (
          <button
            onClick={next}
            className="w-full border border-white/20 text-white/70 rounded-2xl py-3.5 font-mono text-[11px] tracking-[1px]"
          >
            NEXT →
          </button>
        )}
      </div>
    </div>
  )
}
