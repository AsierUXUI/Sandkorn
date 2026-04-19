'use client'

import { useEffect } from 'react'
import { Bubble } from '@/components/ui/Bubble'
import type { Finding, RingLevel } from '@/types/finding'

interface FindingSheetProps {
  finding: Finding
  onClose: () => void
}

const RING_META: Record<RingLevel, { label: string; cls: string }> = {
  verified:  { label: 'VERIFIED',  cls: 'bg-teal-bg text-teal-2 border border-teal-border' },
  reported:  { label: 'REPORTED',  cls: 'bg-amber-bg text-amber border border-amber-border' },
  community: { label: 'COMMUNITY', cls: 'bg-bg text-mid border border-border' },
}

const RING_COPY: Record<RingLevel, string> = {
  verified:  'Court records, regulatory rulings, or primary-source reporting.',
  reported:  'Cited journalism or secondary sources — credible but not yet adjudicated.',
  community: 'Submitted by the community. Read critically; not independently verified.',
}

function formatDate(d: string): string {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function FindingSheet({ finding, onClose }: FindingSheetProps) {
  const ring = RING_META[finding.ring]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[200] bg-black/40" onClick={onClose} aria-hidden />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[201] max-w-[430px] mx-auto bg-bg rounded-t-3xl px-5 pt-5 pb-10 shadow-[0_-8px_40px_rgba(0,0,0,.15)]">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-border2 rounded-full mx-auto mb-5" />

        {/* Ring badge + impact tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`font-mono text-[9px] px-2.5 py-1 rounded-full tracking-[.5px] ${ring.cls}`}>
            {ring.label}
          </span>
          <Bubble type={finding.impactTag} />
          <span className="font-mono text-[9px] text-dim ml-auto">{formatDate(finding.date)}</span>
        </div>

        {/* Headline */}
        <h2 className="font-syne font-extrabold text-[20px] leading-tight mb-2">{finding.headline}</h2>

        {/* Ring credibility note */}
        <p className="font-caveat text-[14px] text-mid mb-3">{RING_COPY[finding.ring]}</p>

        {/* Body */}
        <p className="text-[13px] text-mid leading-relaxed mb-5">{finding.body}</p>

        {/* Source row */}
        <div className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-3 mb-5">
          <div>
            <p className="font-mono text-[9px] text-dim tracking-[.5px] mb-0.5">SOURCE</p>
            <p className="text-[13px] font-medium">{finding.source}</p>
          </div>
          {finding.sourceUrl && (
            <a
              href={finding.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-teal no-underline flex-shrink-0"
            >
              Read →
            </a>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-transparent border border-border rounded-xl py-3 text-[13px] text-mid cursor-pointer"
        >
          Close
        </button>
      </div>
    </>
  )
}
