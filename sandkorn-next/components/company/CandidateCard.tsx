import Link from 'next/link'
import { Bubble } from '@/components/ui/Bubble'
import type { Company } from '@/types/company'

interface CandidateCardProps {
  company: Company
  rank: number
  /** Simulated vote percentage (static until backend) */
  votePct: number
  divider?: boolean
}

export function CandidateCard({ company, rank, votePct, divider = true }: CandidateCardProps) {
  return (
    <Link
      href={`/companies/${company.id}`}
      className={`flex items-start gap-3 px-4 py-3.5 no-underline text-text hover:bg-bg transition-colors ${
        divider ? 'border-b border-border last:border-b-0' : ''
      }`}
    >
      {/* Rank */}
      <div className="w-5 flex-shrink-0 pt-0.5 font-mono text-[11px] text-dim text-center">
        {rank}
      </div>

      {/* Logo */}
      <div
        className="w-9 h-9 rounded-[9px] flex items-center justify-center font-mono font-bold text-[11px] flex-shrink-0"
        style={{ background: company.logoBg, color: company.logoCl }}
      >
        {company.logo}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-syne font-bold text-[14px]">{company.name}</span>
          <div className="flex gap-1">
            {company.bubbles.slice(0, 2).map((b) => (
              <Bubble key={b} type={b} />
            ))}
          </div>
        </div>
        {company.candidatePitch && (
          <p className="text-[11px] text-mid leading-snug mb-1.5">{company.candidatePitch}</p>
        )}
        {/* Vote bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-[4px] bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-sand rounded-full transition-all"
              style={{ width: `${votePct}%` }}
            />
          </div>
          <span className="font-mono text-[9px] text-dim flex-shrink-0">{votePct}%</span>
        </div>
      </div>

      {/* Chevron */}
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-dim flex-shrink-0 mt-1"
      >
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </Link>
  )
}
