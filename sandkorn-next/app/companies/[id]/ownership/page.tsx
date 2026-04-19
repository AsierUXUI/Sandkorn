import { notFound } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { companies } from '@/lib/data/companies'

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }))
}

export default async function OwnershipPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const company = companies.find((c) => c.id === id)
  if (!company) notFound()

  return (
    <div className="min-h-screen flex flex-col max-w-[430px] md:max-w-[860px] mx-auto pb-16">
      <TopBar showBack backHref={`/companies/${id}`} title={company.name} />

      <div className="flex-1 px-5 pt-4">
        <p className="font-mono text-[10px] text-dim tracking-[1px] mb-4">WHO OWNS THIS</p>

        {/* Placeholder — interactive tree coming in Phase 2 */}
        <div className="bg-white border border-border rounded-2xl p-8 text-center">
          <div className="text-[40px] mb-4">🏢</div>
          <p className="font-syne font-bold text-[15px] mb-2">{company.name}</p>
          <p className="text-[13px] text-mid mb-1">{company.sub}</p>
          <p className="text-[12px] text-dim leading-relaxed mt-4">
            Interactive ownership map coming in the next version.
          </p>
        </div>
      </div>
    </div>
  )
}
