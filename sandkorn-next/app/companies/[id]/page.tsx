import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { Bubble } from '@/components/ui/Bubble'
import { AlternativeCard } from '@/components/alternatives/AlternativeCard'
import { companies } from '@/lib/data/companies'
import { getAlternativesFor } from '@/lib/data/alternatives'
import { JOURNEY_PHASES } from '@/lib/data/journey'
import { CompanyLogoImage } from '@/components/company/CompanyLogoImage'

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }))
}

export default async function CompanyDossierPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const company = companies.find((c) => c.id === id)
  if (!company) notFound()

  const alts = getAlternativesFor(company.id)
  const companyActionsCount =
    company.actions?.filter((a) => !a.isOwnerAction).length ?? 0

  // Phase 0 demo journey state
  const doneCount = 1 // grain auto-completed
  const totalCount = JOURNEY_PHASES.length
  const nextStep = JOURNEY_PHASES[1] // 'cut' — Delete the app

  return (
    <div className="min-h-screen flex flex-col max-w-[430px] md:max-w-[860px] mx-auto pb-24">
      <TopBar showBack backHref="/companies" />

      {/* Hero */}
      <div className="px-5 pt-4 pb-5 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <CompanyLogoImage
            src={company.logoImg}
            alt={company.name}
            fallback={company.logo}
            bg={company.logoBg}
            cl={company.logoCl}
          />
          <div>
            <h1 className="font-syne font-bold text-xl leading-tight">{company.name}</h1>
            <p className="text-dim text-[13px]">{company.sub}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {company.bubbles.map((b) => (
            <Bubble key={b} type={b} />
          ))}
        </div>

        {company.isActiveBoycott && (
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#e05050] flex-shrink-0" />
            <span className="font-mono text-[10px] text-dim tracking-wide">BOYCOTT OF THE MONTH</span>
            {company.daysLeft && (
              <span className="font-mono text-[10px] text-teal font-semibold ml-auto">
                {company.daysLeft} days left
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hub content */}
      <div className="flex-1 px-5 pt-4">

        {/* ── Journey CTA card (primary) ── */}
        <Link href={`/companies/${id}/journey`} className="no-underline block mb-3">
          <div className="bg-teal rounded-[18px] p-4 relative overflow-hidden">
            {/* Background grain watermark */}
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

            {/* Mini path dots */}
            <div className="flex items-center gap-1.5 mb-3">
              {JOURNEY_PHASES.map((phase, i) => (
                <Fragment key={phase.key}>
                  {i > 0 && (
                    <div className="flex-1 h-px bg-white/25 max-w-6 min-w-[8px]" />
                  )}
                  <div
                    className={`rounded-full flex-shrink-0 ${
                      i < doneCount
                        ? 'w-3 h-3 bg-white/90'
                        : i === doneCount
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
                  Step {doneCount + 1} of {totalCount}
                </p>
                <p className="text-[12px] text-white/80">Next: {nextStep.title}</p>
              </div>
              <span className="text-[13px] text-white font-semibold flex-shrink-0">
                Continue →
              </span>
            </div>
          </div>
        </Link>

        {/* ── Secondary nav rows ── */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden mb-4">
          <Link
            href={`/companies/${id}/findings`}
            className="flex items-center justify-between px-4 py-3.5 border-b border-border no-underline text-text hover:bg-bg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-[18px]">🔍</span>
              <div>
                <p className="text-[13px] font-semibold leading-tight">What we found</p>
                <p className="text-[11px] text-dim mt-px">
                  {companyActionsCount > 0
                    ? `${companyActionsCount} documented action${companyActionsCount !== 1 ? 's' : ''}`
                    : 'Sources & evidence'}
                </p>
              </div>
            </div>
            <span className="text-dim text-[20px] leading-none">›</span>
          </Link>

          <Link
            href={`/companies/${id}/ownership`}
            className="flex items-center justify-between px-4 py-3.5 no-underline text-text hover:bg-bg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-[18px]">🏢</span>
              <div>
                <p className="text-[13px] font-semibold leading-tight">Who owns this</p>
                <p className="text-[11px] text-dim mt-px">Ownership &amp; structure</p>
              </div>
            </div>
            <span className="text-dim text-[20px] leading-none">›</span>
          </Link>
        </div>

        {/* ── Alternatives carousel ── */}
        {alts.length > 0 && (
          <>
            <p className="font-mono text-[10px] text-dim tracking-[1px] mb-2">
              ALTERNATIVES · WE EARN NOTHING FROM THESE
            </p>
            <div className="flex flex-col bg-white border border-border rounded-2xl overflow-hidden mb-4">
              {alts.map((alt) => (
                <AlternativeCard key={alt.id} alt={alt} />
              ))}
            </div>
          </>
        )}

      </div>

      {/* Sticky CTA bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] md:max-w-[860px] bg-white/96 backdrop-blur-md border-t border-border px-5 py-3 flex gap-2 z-[200] pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
        <Link
          href={`/companies/${id}/journey`}
          className="flex-1 flex items-center justify-center bg-teal text-white rounded-xl py-3 font-semibold text-[14px] no-underline"
        >
          {company.actionType === 'gdpr'
            ? 'Send GDPR deletion request 🌾'
            : 'Start Boycott 🌾'}
        </Link>
        <button className="w-[46px] h-[46px] rounded-xl border border-border bg-white cursor-pointer flex items-center justify-center flex-shrink-0">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>
      </div>
    </div>
  )
}
