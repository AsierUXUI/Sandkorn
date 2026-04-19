'use client'

import { useState } from 'react'
import type { Finding, RingLevel } from '@/types/finding'
import { FindingSheet } from './FindingSheet'

interface EvidenceMapProps {
  companyName: string
  companyLogo: string
  companyLogoBg: string
  companyLogoCl: string
  companyLogoImg?: string
  findings: Finding[]
}

const CX = 170
const CY = 175
const R = { verified: 72, reported: 118, community: 157 }
const DOT_R = 11

const RING_COLORS: Record<RingLevel, { stroke: string; fill: string; text: string; label: string }> = {
  verified:  { stroke: '#1a7a6a', fill: '#1a7a6a', text: '#ffffff', label: 'VERIFIED' },
  reported:  { stroke: '#c8a464', fill: '#c8a464', text: '#ffffff', label: 'REPORTED' },
  community: { stroke: '#9aa09a', fill: '#9aa09a', text: '#ffffff', label: 'COMMUNITY' },
}

function getPositions(r: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) }
  })
}

export function EvidenceMap({
  companyName,
  companyLogo,
  companyLogoBg,
  companyLogoCl,
  companyLogoImg,
  findings,
}: EvidenceMapProps) {
  const [selected, setSelected] = useState<Finding | null>(null)

  const byRing: Record<RingLevel, Finding[]> = {
    verified:  findings.filter((f) => f.ring === 'verified'),
    reported:  findings.filter((f) => f.ring === 'reported'),
    community: findings.filter((f) => f.ring === 'community'),
  }

  return (
    <>
      <div className="px-3.5 pt-5 pb-2">
        <p className="font-mono text-[9px] text-dim tracking-[1px] mb-3">WHAT WE GOT</p>

        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <svg
            viewBox="0 0 340 350"
            className="w-full"
            aria-label={`Evidence map for ${companyName}`}
          >
            {/* ── Ring tracks ──────────────────────────────────────────── */}
            {(Object.keys(R) as RingLevel[]).map((level) => (
              <circle
                key={level}
                cx={CX}
                cy={CY}
                r={R[level]}
                fill="none"
                stroke={RING_COLORS[level].stroke}
                strokeWidth={level === 'verified' ? 1.5 : 1}
                strokeOpacity={level === 'verified' ? 0.35 : 0.2}
                strokeDasharray={level === 'community' ? '4 6' : level === 'reported' ? '5 5' : '0'}
              />
            ))}

            {/* ── Ring labels ───────────────────────────────────────────── */}
            <text x={CX + R.verified + 7}  y={CY - 3} fontSize="7" fill="#9aa09a" fontFamily="monospace" letterSpacing="0.5">VERIFIED</text>
            <text x={CX + R.reported + 7}  y={CY - 3} fontSize="7" fill="#9aa09a" fontFamily="monospace" letterSpacing="0.5">REPORTED</text>
            <text x={CX + R.community + 7} y={CY - 3} fontSize="7" fill="#9aa09a" fontFamily="monospace" letterSpacing="0.5">COMMUNITY</text>

            {/* ── Company center ────────────────────────────────────────── */}
            <circle cx={CX} cy={CY} r={40} fill={companyLogoBg} />
            {companyLogoImg ? (
              <image
                href={companyLogoImg}
                x={CX - 18}
                y={CY - 18}
                width={36}
                height={36}
                preserveAspectRatio="xMidYMid meet"
              />
            ) : (
              <text
                x={CX}
                y={CY + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="22"
                fontWeight="800"
                fontFamily="Syne, sans-serif"
                fill={companyLogoCl}
              >
                {companyLogo}
              </text>
            )}

            {/* ── Finding dots ──────────────────────────────────────────── */}
            {(Object.keys(byRing) as RingLevel[]).map((level) => {
              const items = byRing[level]
              const positions = getPositions(R[level], Math.max(items.length, 1))
              const color = RING_COLORS[level]

              return items.map((finding, i) => {
                const pos = positions[i]
                const isSelected = selected?.id === finding.id

                return (
                  <g
                    key={finding.id}
                    onClick={() => setSelected(finding)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    aria-label={finding.headline}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={DOT_R + (isSelected ? 3 : 0)}
                      fill={isSelected ? color.fill : color.fill}
                      opacity={isSelected ? 1 : 0.85}
                      stroke={isSelected ? '#ffffff' : 'none'}
                      strokeWidth={isSelected ? 2 : 0}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 0.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="9"
                      fontWeight="700"
                      fontFamily="monospace"
                      fill={color.text}
                      style={{ pointerEvents: 'none' }}
                    >
                      {i + 1}
                    </text>
                  </g>
                )
              })
            })}

            {/* ── Legend ───────────────────────────────────────────────── */}
            {(['verified', 'reported', 'community'] as RingLevel[]).map((level, i) => {
              const color = RING_COLORS[level]
              const count = byRing[level].length
              const y = 322 + i * 12
              return (
                <g key={level}>
                  <circle cx={18} cy={y} r={5} fill={color.fill} opacity={0.85} />
                  <text x={28} y={y + 0.5} dominantBaseline="middle" fontSize="8" fill="#5a5f58" fontFamily="monospace" letterSpacing="0.3">
                    {color.label} · {count}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Tap hint */}
          <p className="font-mono text-[9px] text-dim text-center tracking-[.5px] pb-3">
            TAP A DOT TO READ THE FINDING
          </p>
        </div>
      </div>

      {selected && (
        <FindingSheet finding={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
