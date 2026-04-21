'use client'

import { useState, Fragment } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Bubble } from '@/components/ui/Bubble'
import { BannerCard } from '@/components/ui/BannerCard'
import { CandidateCard } from '@/components/company/CandidateCard'
import { BriefingTrigger } from '@/components/briefing/BriefingTrigger'
import { companies } from '@/lib/data/companies'
import { getActiveBoycott, nextBoycottCandidates } from '@/lib/data/boycotts'
import { getBannerForBoycottPage } from '@/lib/data/banners'
import { getAlternativesFor } from '@/lib/data/alternatives'
import { JOURNEY_PHASES } from '@/lib/data/journey'

const GrainPile = dynamic(() => import('@/components/grain/GrainPile'), { ssr: false })

type Scope = 'you' | 'city' | 'dk'

const activeBoycott = getActiveBoycott()
const activeCompany = companies.find((c) => c.id === activeBoycott?.companyId)
const candidateCompanies = companies.filter((c) => nextBoycottCandidates.includes(c.id))
const activeBanner = getBannerForBoycottPage()
const woltAlts = activeBoycott ? getAlternativesFor(activeBoycott.companyId).slice(0, 3) : []

// Phase 0 demo journey state
const DONE_COUNT = 1
const TOTAL_COUNT = JOURNEY_PHASES.length
const NEXT_STEP = JOURNEY_PHASES[DONE_COUNT]

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

          {/* Company row */}
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

          {/* Grain pile */}
          <div className="flex min-h-[140px]">
            <div className="flex-1 relative overflow-hidden border-r border-border bg-bg">
              <GrainPile count={data.grains} scope={scope} />
            </div>
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
        </div>

        {/* ── Banner (action > event, one at a time) ── */}
        {activeBanner && (
          <div className="px-5 mt-2 mb-3">
            <BannerCard banner={activeBanner} />
          </div>
        )}

        {/* ── Journey card ── */}
        <div className="px-5 mb-4">
          <BriefingTrigger boycottId={activeBoycott.id} companyId={activeCompany.id} source="landing">
            <div className="bg-teal rounded-[18px] p-4 relative overflow-hidden cursor-pointer">
              <div
                className="absolute -right-3 -top-3 text-[72px] leading-none pointer-events-none select-none"
                style={{ opacity: 0.12 }}
                aria-hidden
              >
                🌾
              </div>
              <p className="font-mono text-[9px] text-white/70 tracking-[1px] mb-2">
                YOUR BOYCOTT JOURNEY
              </p>
              <div className="flex items-center gap-1.5 mb-3">
                {JOURNEY_PHASES.map((phase, i) => (
                  <Fragment key={phase.key}>
                    {i > 0 && <div className="flex-1 h-px bg-white/25 max-w-6 min-w-[8px]" />}
                    <div
                      className={`rounded-full flex-shrink-0 ${
                        i < DONE_COUNT
                          ? 'w-3 h-3 bg-white/90'
                          : i === DONE_COUNT
                          ? 'w-4 h-4 bg-white border-2 border-white/50 shadow-[0_0_0_3px_rgba(255,255,255,.18)]'
                          : 'w-2.5 h-2.5 bg-white/30'
                      }`}
                    />
                  </Fragment>
                ))}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-syne font-extrabold text-[17px] text-white leading-tight mb-0.5">
                    Step {DONE_COUNT + 1} of {TOTAL_COUNT}
                  </p>
                  <p className="text-[12px] text-white/80">Next: {NEXT_STEP.title}</p>
                </div>
                <span className="text-[13px] text-white font-semibold flex-shrink-0">Continue →</span>
              </div>
            </div>
          </BriefingTrigger>
        </div>

        {/* ── Alternatives carousel ── */}
        {woltAlts.length > 0 && (
          <div className="mb-5">
            <div className="px-5 mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] text-dim tracking-[1px]">ALTERNATIVES · WE EARN NOTHING FROM THESE</span>
            </div>
            <div className="flex gap-3 px-5 overflow-x-auto scrollbar-none pb-1">
              {woltAlts.map((alt) => (
                <a
                  key={alt.id}
                  href={alt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-[150px] bg-white border border-border rounded-2xl p-3 no-underline text-text flex flex-col gap-2"
                >
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center font-mono font-bold text-[11px]"
                    style={{ background: alt.logoBg, color: alt.logoCl }}
                  >
                    {alt.logo}
                  </div>
                  <div>
                    <p className="font-syne font-bold text-[13px] leading-tight">{alt.name}</p>
                    <p className="font-mono text-[9px] text-dim mt-0.5">{alt.sub}</p>
                  </div>
                  <div className="flex gap-1 flex-wrap mt-auto">
                    {alt.danish && (
                      <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-teal-bg text-teal border border-teal-border">Danish</span>
                    )}
                    {alt.eu && !alt.danish && (
                      <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-teal-bg text-teal border border-teal-border">EU</span>
                    )}
                    {alt.free && (
                      <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-bg text-dim border border-border">Free</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Vote for next boycott ── */}
        {candidateCompanies.length > 0 && (
          <>
            <div className="px-5 mt-2 mb-2">
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

      </div>

    </div>
  )
}
