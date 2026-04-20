import Image from 'next/image'
import type { Company } from '@/types/company'
import type { Boycott } from '@/types/boycott'

interface PathHeaderProps {
  company: Company
  boycott: Boycott
  totalGrains: number
}

function getDayProgress(startDate: string, endDate: string) {
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
  const urgency = daysLeft <= 5

  return (
    <div className="bg-text mx-3.5 mt-4 mb-2 rounded-2xl overflow-hidden">
      {/* Main row */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
        {/* Left: logo + company name */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{ background: company.logoBg }}
          >
            {company.logoImg ? (
              <Image
                src={company.logoImg}
                alt={company.name}
                width={32}
                height={32}
                className="object-contain"
              />
            ) : (
              <span className="font-syne font-extrabold text-[20px]" style={{ color: company.logoCl }}>
                {company.logo}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-syne font-extrabold text-[17px] text-white leading-tight truncate">
              {company.name}
            </p>
            <p className="font-mono text-[9px] text-white/40 tracking-[.5px] mt-0.5">
              DAY {day} OF BOYCOTT
            </p>
          </div>
        </div>

        {/* Right: total grains */}
        <div className="flex-shrink-0 text-right">
          <p className="font-syne font-extrabold text-[32px] leading-none text-sand">{totalGrains}</p>
          <p className="font-mono text-[8px] text-white/40 tracking-[1px] mt-0.5">GRAINS</p>
        </div>
      </div>

      {/* Countdown strip */}
      <div
        className={`px-4 py-2.5 flex items-center justify-between ${
          urgency ? 'bg-warn/20' : 'bg-white/[0.06]'
        }`}
      >
        <span className="font-mono text-[9px] tracking-[1.5px] text-white/50">
          {boycott.tagline?.toUpperCase() ?? 'BOYCOTT IN PROGRESS'}
        </span>
        <span
          className={`font-syne font-extrabold text-[13px] ${
            urgency ? 'text-warn' : 'text-white/80'
          }`}
        >
          {daysLeft > 0 ? `${daysLeft} DAYS LEFT` : 'TODAY IS THE LAST DAY'}
        </span>
      </div>
    </div>
  )
}
