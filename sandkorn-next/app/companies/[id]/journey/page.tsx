import { notFound } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { PathHeader } from '@/components/journey/PathHeader'
import { JourneyPath } from '@/components/journey/JourneyPath'
import { companies } from '@/lib/data/companies'
import { getJourneyConfig } from '@/lib/data/journeys'
import { getActiveBoycott } from '@/lib/data/boycotts'

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }))
}

// Phase 0 demo: first node completed, second node active
const DEMO_COMPLETED = ['wolt-share']
const DEMO_ACTIVE = 'wolt-delete'

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const company = companies.find((c) => c.id === id)
  if (!company) notFound()

  const config = getJourneyConfig(id)
  if (!config) notFound()

  const boycott = getActiveBoycott()
  const doneCount = DEMO_COMPLETED.length
  const totalCount = config.nodes.length

  return (
    <div className="min-h-screen flex flex-col max-w-[430px] md:max-w-[860px] mx-auto pb-16">
      <TopBar
        showBack
        backHref={`/companies/${id}`}
        title="Boycott plan"
        right={
          <span className="font-mono text-[9px] bg-teal text-white rounded-full px-2.5 py-1 tracking-[.5px]">
            {doneCount}/{totalCount}
          </span>
        }
      />

      {boycott && (
        <PathHeader
          company={company}
          boycott={boycott}
          totalGrains={config.totalGrains}
        />
      )}

      <JourneyPath
        config={config}
        activeNodeId={DEMO_ACTIVE}
        completedNodeIds={DEMO_COMPLETED}
      />
    </div>
  )
}
