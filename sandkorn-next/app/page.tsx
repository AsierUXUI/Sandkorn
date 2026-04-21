'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Bubble } from '@/components/ui/Bubble'
import { CompanyRow } from '@/components/company/CompanyRow'
import { CandidateCard } from '@/components/company/CandidateCard'
import { BriefingTrigger } from '@/components/briefing/BriefingTrigger'
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
  return n.toLocaleString('en-DK')
}

export default function HomePage() {
  const [scope, setScope] = useState<Scope>('city')

  if (!activeBoycott || !activeCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center text-dim font-mono text-[11px]">
        No active boycott this month.
      </div>
    )
  }

  const remaining = daysLeft(activeBoycott.endDate)
  const progressPct = Math.min(100, Math.round((activeBoycott.grains / activeBoycott.goal) * 100))

  const scopeData = {
    you:  { n: formatGrains(activeBoycott.yourGrains), label: "grains you've added",  grains: activeBoycott.yourGrains },
    city: { n: formatGrains(activeBoycott.cityGrains), label: 'grains in your city', grains: Math.min(activeBoycott.cityGrains, 250) },
    dk:   { n: formatGrains(activeBoycott.grains),     label: 'grains in Denmark',   grains: Math.min(activeBoycott.grains, 420) },
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
                <span className="font-mono text-[9px] text-dim tracking-[.5px]">THIS MONTH'S BOYCOTT</span>
                <div className="w-[5px] h-[5px] rounded-full bg-[#e05050]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-teal font-semibold">{remaining} days left</span>
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
              <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              <div className="absolute top-0 left-1/2 w-px h-full bg-black/20" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-syne font-bold text-[12px]">
                {formatGrains(activeBoycott.grains)}{' '}
                <span className="font-mono font-normal text-[9px] text-dim">grains added</span>
              </span>
              <span className="font-mono text-[8px] text-dim pt-0.5">
                {progressPct}% of goal · {formatGrains(activeBoycott.goal)}
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
              <GrainPile count={data.grains} scope={scope} />
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
          <BriefingTrigger boycottId={activeBoycott.id} companyId={activeCompany.id} source="landing">
            <div className="px-4 py-3.5 bg-[#1a1a1a] flex items-center justify-between cursor-pointer border-t-2 border-teal hover:bg-[#2a2a2a] transition-colors">
              <div>
                <div className="text-[15px] font-bold text-white tracking-tight">Join the boycott →</div>
                <div className="font-mono text-[10px] text-white/45 mt-0.5">
                  Boycott {activeCompany.name} this month · see why it matters
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </BriefingTrigger>
        </div>

        {/* ── Next boycott candidates ── */}
        {candidateCompanies.length > 0 && (
          <>
            <div className="px-5 mt-5 mb-2">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-syne font-bold text-[15px]">Vote for next boycott</span>
                <span className="font-mono text-[9px] text-teal tracking-[.3px]">APRIL</span>
              </div>
              <p className="font-mono text-[9px] text-dim leading-snug">
                Who do we boycott next month? Click to read more — voting opens March 25.
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

        {/* ── Banners ── */}
        <div className="px-5 mt-2 mb-3 flex flex-col gap-3">
          {/* Community event banner */}
          <a href="#" className="block no-underline rounded-[14px] overflow-hidden" style={{ background: 'linear-gradient(135deg,rgba(20,10,50,.92) 0%,rgba(40,20,90,.82) 100%)' }}>
            <div className="p-4 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5 bg-white/10 rounded-lg p-1.5">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="9" cy="8.5" r="3.5" fill="rgba(255,255,255,.9)"/>
                  <path d="M3 22c0-3.3 2.7-6 6-6h0c3.3 0 6 2.7 6 6" stroke="rgba(255,255,255,.9)" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="21" cy="8.5" r="3" fill="rgba(255,255,255,.5)"/>
                  <path d="M15.5 22c0-3 2.5-5.5 5.5-5.5h0c3 0 5.5 2.5 5.5 5.5" stroke="rgba(255,255,255,.5)" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M12 27.5 L20 27.5 M17 25 L20 27.5 L17 30" stroke="rgba(38,210,166,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-mono text-[9px] text-white/45 tracking-[.7px] mb-1">COMMUNITY EVENT · JOIN NOW</p>
                <p className="font-caveat font-bold text-[22px] text-white leading-tight mb-1">Leaving Meta Together</p>
                <p className="text-[10px] text-white/60 mb-1.5">📍 Café Blågård, Nørrebro · Thu 27 Mar, 19:00</p>
                <p className="text-[11px] text-white/65 leading-relaxed mb-2.5">A guided session where you migrate your photos, contacts and history — with others making the same move. Explore alternatives side by side.</p>
                <span className="inline-flex items-center gap-1 bg-white/12 border border-white/18 rounded-full px-3 py-1 font-mono text-[9px] text-white tracking-[.3px]">See event details →</span>
              </div>
            </div>
          </a>

          {/* EU Citizens' Initiative banner */}
          <a
            href="https://citizens-initiative.europa.eu/initiatives/details/2025/000002_en"
            target="_blank"
            rel="noopener noreferrer"
            className="block no-underline rounded-[14px] overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg,#003399 0%,#1a4fa8 100%)' }}
          >
            <div className="absolute right-[-18px] top-[-18px] w-[100px] h-[100px] rounded-full bg-white/4 pointer-events-none" />
            <div className="p-4 flex items-start gap-3 relative">
              <div className="flex-shrink-0 mt-0.5 bg-white/12 rounded-lg p-1.5">
                <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="50.00,2.00 52.47,8.60 59.51,8.91 53.99,13.30 55.88,20.09 50.00,16.20 44.12,20.09 46.01,13.30 40.49,8.91 47.53,8.60" fill="#FFCC00"/>
                  <polygon points="69.00,7.09 71.47,13.69 78.51,14.00 72.99,18.39 74.88,25.18 69.00,21.29 63.12,25.18 65.01,18.39 59.49,14.00 66.53,13.69" fill="#FFCC00"/>
                  <polygon points="82.91,21.00 85.38,27.60 92.42,27.91 86.90,32.30 88.79,39.09 82.91,35.20 77.03,39.09 78.91,32.30 73.40,27.91 80.44,27.60" fill="#FFCC00"/>
                  <polygon points="88.00,40.00 90.47,46.60 97.51,46.91 91.99,51.30 93.88,58.09 88.00,54.20 82.12,58.09 84.01,51.30 78.49,46.91 85.53,46.60" fill="#FFCC00"/>
                  <polygon points="82.91,59.00 85.38,65.60 92.42,65.91 86.90,70.30 88.79,77.09 82.91,73.20 77.03,77.09 78.91,70.30 73.40,65.91 80.44,65.60" fill="#FFCC00"/>
                  <polygon points="69.00,72.91 71.47,79.51 78.51,79.82 72.99,84.21 74.88,91.00 69.00,87.11 63.12,91.00 65.01,84.21 59.49,79.82 66.53,79.51" fill="#FFCC00"/>
                  <polygon points="50.00,78.00 52.47,84.60 59.51,84.91 53.99,89.30 55.88,96.09 50.00,92.20 44.12,96.09 46.01,89.30 40.49,84.91 47.53,84.60" fill="#FFCC00"/>
                  <polygon points="31.00,72.91 33.47,79.51 40.51,79.82 34.99,84.21 36.88,91.00 31.00,87.11 25.12,91.00 27.01,84.21 21.49,79.82 28.53,79.51" fill="#FFCC00"/>
                  <polygon points="17.09,59.00 19.56,65.60 26.60,65.91 21.09,70.30 22.97,77.09 17.09,73.20 11.21,77.09 13.10,70.30 7.58,65.91 14.62,65.60" fill="#FFCC00"/>
                  <polygon points="12.00,40.00 14.47,46.60 21.51,46.91 15.99,51.30 17.88,58.09 12.00,54.20 6.12,58.09 8.01,51.30 2.49,46.91 9.53,46.60" fill="#FFCC00"/>
                  <polygon points="17.09,21.00 19.56,27.60 26.60,27.91 21.09,32.30 22.97,39.09 17.09,35.20 11.21,39.09 13.10,32.30 7.58,27.91 14.62,27.60" fill="#FFCC00"/>
                  <polygon points="31.00,7.09 33.47,13.69 40.51,14.00 34.99,18.39 36.88,25.18 31.00,21.29 25.12,25.18 27.01,18.39 21.49,14.00 28.53,13.69" fill="#FFCC00"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-mono text-[9px] text-white/45 tracking-[.7px] mb-1">EUROPEAN CITIZENS' INITIATIVE · SIGN NOW</p>
                <p className="font-syne font-bold text-[13px] text-white leading-snug mb-1.5">Stop funding Big Tech with public money</p>
                <p className="text-[11px] text-white/65 leading-relaxed mb-2.5">An EU-wide petition demanding governments stop buying services from companies that exploit citizens. 1 million signatures triggers a European law.</p>
                <span className="inline-flex items-center gap-1 bg-white/15 border border-white/20 rounded-full px-3 py-1 font-mono text-[9px] text-white tracking-[.3px]">Sign the initiative →</span>
              </div>
            </div>
          </a>
        </div>

        {/* ── More companies section ── */}
        <div className="px-5 mt-1 mb-2 flex items-center justify-between">
          <span className="font-syne font-bold text-[15px]">More companies</span>
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
