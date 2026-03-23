'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { Bubble } from '@/components/ui/Bubble'
import { Button } from '@/components/ui/Button'
import { AlternativeCard } from '@/components/alternatives/AlternativeCard'
import { companies } from '@/lib/data/companies'
import { getAlternativesFor } from '@/lib/data/alternatives'
import type { BubbleKey } from '@/types/company'

const TABS = ['WHAT WE FOUND', 'WHO OWNS IT', 'MIGRATE']

export default function CompanyDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const company = companies.find((c) => c.id === id)

  if (!company) notFound()

  const [activeTab, setActiveTab] = useState(0)

  const companyActions = company.actions?.filter((a) => !a.isOwnerAction) ?? []
  const ownerActions = company.actions?.filter((a) => a.isOwnerAction) ?? []
  const alts = getAlternativesFor(company.id)

  return (
    <div className="min-h-screen flex flex-col max-w-[430px] md:max-w-[860px] mx-auto pb-24">
      <TopBar showBack backHref="/companies" />

      {/* Hero */}
      <div className="px-5 pt-4 pb-5 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-[12px] flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden"
            style={{ background: company.logoBg, color: company.logoCl }}
          >
            <Image
              src={company.logoImg}
              alt={company.name}
              width={48}
              height={48}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement
                el.style.display = 'none'
                el.parentElement!.textContent = company.logo
              }}
            />
          </div>
          <div>
            <h1 className="font-syne font-bold text-xl leading-tight">{company.name}</h1>
            <p className="text-dim text-[13px]">{company.sub}</p>
          </div>
        </div>

        {/* Issue bubbles */}
        <div className="flex flex-wrap gap-1 mb-3">
          {company.bubbles.map((b) => (
            <Bubble key={b} type={b} />
          ))}
        </div>

        {/* Active boycott badge */}
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

      {/* Tabs */}
      <div className="flex border-b border-border sticky top-[57px] bg-bg/96 backdrop-blur-md z-50">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2.5 border-none bg-none cursor-pointer font-mono text-[9px] tracking-[.5px] border-b-2 -mb-px transition-all ${
              activeTab === i
                ? 'text-teal border-teal'
                : 'text-dim border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 px-5 pt-4">

        {/* Tab 0: What we found */}
        {activeTab === 0 && (
          <div>
            {companyActions.length > 0 && (
              <>
                <p className="font-mono text-[10px] text-dim tracking-[1px] mb-2">COMPANY ACTIONS</p>
                <div className="bg-white border border-border rounded-2xl overflow-hidden mb-3">
                  {companyActions.map((action, i) => (
                    <div
                      key={action.id}
                      className={`px-4 py-3 ${i < companyActions.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-mono text-[10px] text-dim">
                          {action.date} · {action.source}
                        </span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {action.bubbles.map((b: BubbleKey) => (
                            <Bubble key={b} type={b} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[13px] text-mid leading-relaxed mb-2">{action.text}</p>
                      <a
                        href={action.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-teal no-underline"
                      >
                        {new URL(action.sourceUrl).hostname.replace('www.', '')} →
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}

            {ownerActions.length > 0 && (
              <>
                <p className="font-mono text-[10px] text-amber tracking-[1px] mb-2">OWNER ACTIONS</p>
                <div className="bg-white border border-border rounded-2xl overflow-hidden mb-4">
                  {ownerActions.map((action, i) => (
                    <div
                      key={action.id}
                      className={`px-4 py-3 border-l-[3px] border-amber ${i < ownerActions.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-mono text-[10px] text-dim">
                          {action.ownerName?.toUpperCase()} · {action.date}
                        </span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {action.bubbles.map((b: BubbleKey) => (
                            <Bubble key={b} type={b} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[13px] text-mid leading-relaxed mb-2">{action.text}</p>
                      <a
                        href={action.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-teal no-underline"
                      >
                        {new URL(action.sourceUrl).hostname.replace('www.', '')} →
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}

            {companyActions.length === 0 && ownerActions.length === 0 && (
              <div className="text-center py-12 text-dim">
                <p className="font-mono text-[11px]">Dokumentation kommer snart</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Who owns it */}
        {activeTab === 1 && (
          <div className="text-center py-12 text-dim">
            <p className="font-mono text-[11px] mb-2">OWNERSHIP TREE</p>
            <p className="text-[13px]">Interaktivt ejerskabskort kommer i næste version.</p>
          </div>
        )}

        {/* Tab 2: Migrate */}
        {activeTab === 2 && (
          <div>
            {alts.length > 0 ? (
              <>
                <p className="font-mono text-[10px] text-dim tracking-[1px] mb-2">
                  ALTERNATIVER TIL {company.name.toUpperCase()}
                </p>
                <div className="bg-white border border-border rounded-2xl overflow-hidden mb-4">
                  {alts.map((alt) => (
                    <AlternativeCard key={alt.id} alt={alt} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-dim">
                <p className="font-mono text-[11px]">Alternativer kommer snart</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky CTA bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] md:max-w-[860px] bg-white/96 backdrop-blur-md border-t border-border px-5 py-3 flex gap-2 z-[200] pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
        {company.actionType === 'gdpr' ? (
          <Button variant="teal">
            Send GDPR sletteanmodning 🌾
          </Button>
        ) : (
          <Button variant="teal">
            Start bojkot 🌾
          </Button>
        )}
        <button className="w-[46px] h-[46px] rounded-xl border border-border bg-white cursor-pointer flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
