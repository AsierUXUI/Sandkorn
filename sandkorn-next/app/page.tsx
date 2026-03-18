'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Bubble } from '@/components/ui/Bubble'
import { CompanyRow } from '@/components/company/CompanyRow'
import { companies } from '@/lib/data/companies'

const GrainPile = dynamic(() => import('@/components/grain/GrainPile'), { ssr: false })

type Scope = 'you' | 'city' | 'dk'

const SCOPE_DATA: Record<Scope, { n: string; label: string; eur: string; sub: string; grains: number }> = {
  you:  { n: '3',     label: 'grains dropped',   eur: '625 kr',      sub: 'your yearly impact',   grains: 3 },
  city: { n: '1,247', label: 'grains this week',  eur: '841.250 kr',  sub: '+312 this week',        grains: 180 },
  dk:   { n: '9,284', label: 'grains this month', eur: '6,27M kr',    sub: '+2.1k this week',       grains: 420 },
}

const activeCompany = companies.find((c) => c.id === 'meta')!
const otherCompanies = companies.filter((c) => c.id !== 'meta').slice(0, 5)

export default function HomePage() {
  const [scope, setScope] = useState<Scope>('city')
  const data = SCOPE_DATA[scope]

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-10 max-w-[430px] md:max-w-[860px] mx-auto">

      {/* Topbar */}
      <header className="md:hidden flex items-center justify-between px-5 py-3.5 sticky top-0 z-[100] bg-bg/96 backdrop-blur-[12px]">
        <span className="font-syne font-extrabold text-[19px] tracking-tight">sandkorn</span>
        <button className="w-9 h-9 rounded-full border border-border bg-white cursor-pointer flex items-center justify-center">
          <svg viewBox="0 0 28 28" width="20" height="20" fill="none">
            <circle cx="14" cy="8" r="4" fill="#c8a464"/>
            <circle cx="8" cy="19" r="3.2" fill="#a07830"/>
            <circle cx="20" cy="19" r="3.2" fill="#a07830"/>
            <circle cx="14" cy="25" r="2.4" fill="#c8ccc4"/>
            <line x1="14" y1="12" x2="9" y2="16.2" stroke="#c8ccc4" strokeWidth="1.2"/>
            <line x1="14" y1="12" x2="19" y2="16.2" stroke="#c8ccc4" strokeWidth="1.2"/>
            <line x1="9" y1="22.2" x2="12.5" y2="23.2" stroke="#c8ccc4" strokeWidth="1.2"/>
            <line x1="20" y1="22.2" x2="16.5" y2="23.2" stroke="#c8ccc4" strokeWidth="1.2"/>
          </svg>
        </button>
      </header>

      <div className="overflow-y-auto flex-1">

        {/* ── Boycott card ── */}
        <div className="mx-5 my-3 bg-white border border-border rounded-2xl overflow-hidden">

          {/* Progress bar header */}
          <div className="px-3.5 py-2.5 border-b border-border">
            <div className="flex justify-between items-end mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-dim tracking-[.5px]">BOYCOTT OF THE MONTH</span>
                <div className="w-[5px] h-[5px] rounded-full bg-[#e05050]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-teal font-semibold">18 days left</span>
                {/* Scope switcher */}
                <div className="flex border border-border rounded-[6px] overflow-hidden bg-bg">
                  {(['you', 'city', 'dk'] as Scope[]).map((s) => (
                    <button
                      key={s}
                      onClick={(e) => { e.stopPropagation(); setScope(s) }}
                      className={`px-2.5 py-1 border-none cursor-pointer font-mono text-[9px] tracking-[.3px] transition-all ${
                        scope === s ? 'bg-text text-white' : 'bg-transparent text-dim'
                      }`}
                    >
                      {s === 'you' ? 'YOU' : s === 'city' ? 'CPH' : 'DK'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-[7px] bg-border rounded-full overflow-hidden relative">
              <div className="h-full bg-teal rounded-full" style={{ width: '28%' }} />
              <div className="absolute top-0 left-1/2 w-px h-full bg-black/20" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-syne font-bold text-[12px]">
                1,247 <span className="font-mono font-normal text-[9px] text-dim">joining</span>
              </span>
              <span className="font-mono text-[8px] text-dim pt-0.5">50% = earnings call threshold · goal 4,500</span>
            </div>
          </div>

          {/* Company row — tappable */}
          <Link
            href={`/companies/${activeCompany.id}`}
            className="px-3.5 py-3 flex items-center gap-3 cursor-pointer border-b border-border no-underline text-text"
          >
            <Image
              src={activeCompany.logoImg}
              alt={activeCompany.name}
              width={34}
              height={34}
              className="rounded-lg object-contain flex-shrink-0 border border-border/50"
              style={{ background: activeCompany.logoBg }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-syne font-extrabold text-[17px]">{activeCompany.name}</span>
                <span className="font-mono text-[9px] text-dim">{activeCompany.sub}</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {activeCompany.bubbles.slice(0, 3).map((b) => (
                  <Bubble key={b} type={b} />
                ))}
              </div>
            </div>
          </Link>

          {/* Pile body */}
          <div className="flex min-h-[140px]">
            {/* Canvas side */}
            <div className="flex-1 relative overflow-hidden border-r border-border bg-bg">
              <GrainPile count={data.grains} />
            </div>
            {/* Numbers side */}
            <div className="flex-1 flex flex-col justify-center px-3 py-3 gap-1.5">
              <div>
                <div className="font-syne font-extrabold text-[24px] leading-none">{data.n}</div>
                <div className="font-mono text-[9px] text-mid mt-1 leading-snug">{data.label}</div>
              </div>
              <div className="h-px bg-border" />
              <div>
                <div className="font-syne font-bold text-[15px] text-teal">{data.eur}</div>
                <div className="font-mono text-[9px] text-dim mt-0.5 leading-snug">
                  Estimated impact per year<br />
                  <span className="text-dimmer">Local community impact</span>
                </div>
              </div>
              <span className="font-mono text-[9px] text-teal">{data.sub}</span>
            </div>
          </div>

          {/* Join CTA strip */}
          <Link
            href={`/companies/${activeCompany.id}`}
            className="px-4 py-3.5 bg-[#1a1a1a] flex items-center justify-between cursor-pointer border-t-2 border-teal no-underline hover:bg-[#2a2a2a] transition-colors"
          >
            <div>
              <div className="text-[15px] font-bold text-white tracking-tight">Join this boycott →</div>
              <div className="font-mono text-[10px] text-white/45 mt-0.5">Boycott Meta this month · see why it matters</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        </div>

        {/* ── More companies section ── */}
        <div className="px-5 mt-4 mb-2 flex items-center justify-between">
          <span className="font-syne font-bold text-[15px]">Andre virksomheder</span>
          <Link href="/companies" className="font-mono text-[10px] text-teal no-underline tracking-[.4px]">
            SE ALLE
          </Link>
        </div>
        <div className="mx-5 bg-white border border-border rounded-2xl overflow-hidden mb-6">
          {otherCompanies.map((company) => (
            <CompanyRow key={company.id} company={company} />
          ))}
        </div>

      </div>

    </div>
  )
}
