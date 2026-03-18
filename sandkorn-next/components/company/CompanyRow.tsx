import Link from 'next/link'
import Image from 'next/image'
import type { Company } from '@/types/company'
import { Bubble } from '@/components/ui/Bubble'

interface CompanyRowProps {
  company: Company
}

export function CompanyRow({ company }: CompanyRowProps) {
  return (
    <Link
      href={`/companies/${company.id}`}
      className="flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-b-0 no-underline text-text transition-colors hover:bg-bg/60"
    >
      <div
        className="w-10 h-10 rounded-[10px] flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden"
        style={{ background: company.logoBg, color: company.logoCl }}
      >
        <Image
          src={company.logoImg}
          alt={company.name}
          width={40}
          height={40}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            // fallback to letter logo
            const el = e.currentTarget as HTMLImageElement
            el.style.display = 'none'
            el.parentElement!.textContent = company.logo
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-syne font-bold text-[15px] leading-tight">{company.name}</div>
        <div className="text-dim text-[12px] mt-0.5 truncate">{company.sub}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {company.bubbles.slice(0, 3).map((b) => (
            <Bubble key={b} type={b} />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {company.deletions > 0 && (
          <span className="font-mono text-[10px] text-teal font-medium">
            {company.deletions.toLocaleString()}
          </span>
        )}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa09a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </div>
    </Link>
  )
}
