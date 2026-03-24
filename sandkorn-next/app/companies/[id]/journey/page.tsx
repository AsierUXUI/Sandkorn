import { notFound } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { JourneyPath } from '@/components/journey/JourneyPath'
import { companies } from '@/lib/data/companies'
import { JOURNEY_PHASES } from '@/lib/data/journey'

// Phase 0 demo: grain completed, cut is active
const DEMO_COMPLETED = ['grain'] as const
const DEMO_ACTIVE = 'cut' as const

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const company = companies.find((c) => c.id === id)
  if (!company) notFound()

  const doneCount = DEMO_COMPLETED.length
  const totalCount = JOURNEY_PHASES.length

  return (
    <div className="min-h-screen flex flex-col max-w-[430px] md:max-w-[860px] mx-auto pb-16">
      <TopBar
        showBack
        backHref={`/companies/${id}`}
        title={company.name}
        right={
          <span className="font-mono text-[9px] bg-teal text-white rounded-full px-2.5 py-1 tracking-[.5px]">
            {doneCount}/{totalCount}
          </span>
        }
      />

      <JourneyPath
        companyId={id}
        activeStep={DEMO_ACTIVE}
        completedSteps={[...DEMO_COMPLETED]}
      />
    </div>
  )
}
