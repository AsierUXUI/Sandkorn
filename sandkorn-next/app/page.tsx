'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Bubble } from '@/components/ui/Bubble'
import { CompanyRow } from '@/components/company/CompanyRow'
import { CandidateCard } from '@/components/company/CandidateCard'
import { companies } from '@/lib/data/companies'
import { getActiveBoycott, nextBoycottCandidates } from '@/lib/data/boycotts'

const GrainPile = dynamic(() => import('@/components/grain/GrainPile'), { ssr: false })

type Scope = 'you' | 'city' | 'dk'

const activeBoycott = getActiveBoycott()
const activeCompany = companies.find((c) => c.id === activeBoycott?.companyId)
const candidateCompanies = companies.filter((c) => nextBoycottCandidates.includes(c.id))
const otherCompanies = companies
  .filter((c) => c.id !== activeBoycott?.companyId && !nextBoycottCandidates.includes(c.id))
  .slice(0, 4)

// Static vote distribution (real voting comes with Supabase in Phase 4)
const CANDIDATE_VOTES = [42, 35, 23]

function daysLeft(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

function formatGrains(n: number): string {
  return n.toLocaleString('da-DK')
}

export default function HomePage() {
  const [scope, setScope] = useState<Scope>('city')

  if (!activeBoycott || !activeCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center text-dim font-mono text-[11px]">
        Ingen aktiv bojkot denne måned.
      </div>
    )
  }

  const remaining = daysLeft(activeBoycott.endDate)
  const progressPct = Math.min(100, Math.round((activeBoycott.grains / activeBoycott.goal) * 100))

  const scopeData = {
    you:  { n: formatGrains(activeBoycott.yourGrains), label: 'korn du har lagt', grains: activeBoycott.yourGrains },
    city: { n: formatGrains(activeBoycott.cityGrains), label: 'korn i din by',    grains: Math.min(activeBoycott.cityGrains, 250) },
    dk:   { n: formatGrains(activeBoycott.grains),     label: 'korn i Danmark',   grains: Math.min(activeBoycott.grains, 420) },
  }
  const data = scopeData[scope]

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-10 max-w-[430px] md:max-w-[860px] mx-auto">

      {/* Topbar */}
      <header className="md:hidden flex items-center justify-between px-5 py-3.5 sticky top-0 z-[100] bg-bg/96 backdrop-blur-[12px]">
        <span className="font-syne font-extrabold text-[19px] tracking-tight">sandkorn</span>
        <button className="w-9 h-9 rounded-full border border-border bg-white cursor-pointer flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
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
                <span className="font-mono text-[9px] text-dim tracking-[.5px]">MÅNEDENS BOJKOT</span>
                <div className="w-[5px] h-[5px] rounded-full bg-[#e05050]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-teal font-semibold">{remaining} dage tilbage</span>
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
                      {s === 'you' ? 'DIG' : s === 'city' ? 'CPH' : 'DK'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-[7px] bg-border rounded-full overflow-hidden relative">
              <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              <div className="absolute top-0 left-1/2 w-px h-full bg-black/20" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-syne font-bold text-[12px]">
                {formatGrains(activeBoycott.grains)}{' '}
                <span className="font-mono font-normal text-[9px] text-dim">korn lagt</span>
              </span>
              <span className="font-mono text-[8px] text-dim pt-0.5">
                {progressPct}% af mål · goal {formatGrains(activeBoycott.goal)}
              </span>
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
                <div className="font-syne font-bold text-[14px] text-teal leading-snug">
                  {activeBoycott.tagline}
                </div>
              </div>
            </div>
          </div>

          {/* Join CTA strip */}
          <Link
            href={`/companies/${activeCompany.id}`}
            className="px-4 py-3.5 bg-[#1a1a1a] flex items-center justify-between cursor-pointer border-t-2 border-teal no-underline hover:bg-[#2a2a2a] transition-colors"
          >
            <div>
              <div className="text-[15px] font-bold text-white tracking-tight">Deltag i bojkotten →</div>
              <div className="font-mono text-[10px] text-white/45 mt-0.5">
                Bojkot {activeCompany.name} denne måned · se hvorfor det betyder noget
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        </div>

        {/* ── Next boycott candidates ── */}
        {candidateCompanies.length > 0 && (
          <>
            <div className="px-5 mt-5 mb-2">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-syne font-bold text-[15px]">Vælg næste bojkot</span>
                <span className="font-mono text-[9px] text-teal tracking-[.3px]">APRIL</span>
              </div>
              <p className="font-mono text-[9px] text-dim leading-snug">
                Hvem boycotter vi næste måned? Klik for at læse mere — afstemningen åbner 25. marts.
              </p>
            </div>
            <div className="mx-5 bg-white border border-border rounded-2xl overflow-hidden mb-5">
              {candidateCompanies.map((company, i) => (
                <CandidateCard
                  key={company.id}
                  company={company}
                  rank={i + 1}
                  votePct={CANDIDATE_VOTES[i] ?? 0}
                />
              ))}
            </div>
          </>
        )}

        {/* ── More companies section ── */}
        <div className="px-5 mt-1 mb-2 flex items-center justify-between">
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
