'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Pill } from '@/components/ui/Pill'
import { BannerCard } from '@/components/ui/BannerCard'
import { CompanyRow } from '@/components/company/CompanyRow'
import { companies } from '@/lib/data/companies'
import { getBannerForExplorePage } from '@/lib/data/banners'
import type { Category } from '@/types/company'

const exploreBanner = getBannerForExplorePage()

const CATS: { value: Category | 'all'; label: string }[] = [
  { value: 'all',     label: 'All' },
  { value: 'social',  label: 'Social' },
  { value: 'tech',    label: 'Tech' },
  { value: 'retail',  label: 'Retail' },
  { value: 'food',    label: 'Food' },
  { value: 'finance', label: 'Finance' },
]

export default function CompaniesPage() {
  const [activecat, setActiveCat] = useState<Category | 'all'>('all')

  const filtered = activecat === 'all'
    ? companies
    : companies.filter((c) => c.cat === activecat)

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-10 max-w-[430px] md:max-w-[860px] mx-auto">
      <TopBar title="Boycott" />

      {/* Banner (event > action) */}
      {exploreBanner && (
        <div className="px-5 pt-3 pb-1">
          <BannerCard banner={exploreBanner} />
        </div>
      )}

      {/* Category filter pills */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-none -webkit-overflow-scrolling-touch">
        {CATS.map((c) => (
          <Pill
            key={c.value}
            label={c.label}
            active={activecat === c.value}
            onClick={() => setActiveCat(c.value)}
          />
        ))}
      </div>

      {/* Summary line */}
      <div className="px-5 pb-2">
        <p className="text-dim font-mono text-[10px] tracking-wide">
          {filtered.length} COMPANIES
        </p>
      </div>

      {/* Company list */}
      <div className="mx-5 bg-white rounded-2xl border border-border overflow-hidden">
        {filtered.map((company) => (
          <CompanyRow key={company.id} company={company} />
        ))}
      </div>

    </div>
  )
}
