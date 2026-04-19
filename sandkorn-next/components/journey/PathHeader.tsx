import Image from 'next/image'
import type { Company } from '@/types/company'
import type { Boycott } from '@/types/boycott'

interface PathHeaderProps {
  company: Company
  boycott: Boycott
  totalGrains: number
}

function getDayProgress(startDate: string, endDate: string): { day: number; daysLeft: number; total: number } {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  const total = Math.round((end.getTime() - start.getTime()) / 86400000) + 1
  const day = Math.max(1, Math.min(total, Math.round((now.getTime() - start.getTime()) / 86400000) + 1))
  const daysLeft = Math.max(0, Math.round((end.getTime() - now.getTime()) / 86400000))
  return { day, daysLeft, total }
}

export function PathHeader({ company, boycott, totalGrains }: PathHeaderProps) {
  const { day, daysLeft } = getDayProgress(boycott.startDate, boycott.endDate)

  return (
    <div className="mx-3.5 mt-4 mb-1 bg-white border border-border rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3">
      {/* Left: logo + name + timing */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: company.logoBg }}
        >
          {company.logoImg ? (
            <Image src={company.logoImg} alt={company.name} width={28} height={28} className="object-contain" />
          ) : (
            <span className="font-syne font-extrabold text-[18px]" style={{ color: company.logoCl }}>
              {company.logo}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="font-syne font-extrabold text-[15px] leading-tight truncate">{company.name}</p>
          <p className="font-mono text-[9px] text-dim tracking-[.5px] mt-0.5">
            DAY {day}
            <span className="text-border2 mx-1">·</span>
            {daysLeft > 0 ? `${daysLeft} DAYS LEFT` : 'LAST DAY'}
          </p>
        </div>
      </div>

      {/* Right: total grains to earn */}
      <div className="flex-shrink-0 text-right">
        <p className="font-syne font-extrabold text-[26px] leading-none text-sand">{totalGrains}</p>
        <p className="font-mono text-[8px] text-dim tracking-[.8px] mt-0.5">GRAINS</p>
      </div>
    </div>
  )
}
