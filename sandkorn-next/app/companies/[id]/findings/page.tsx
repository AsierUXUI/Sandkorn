import { notFound } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { Bubble } from '@/components/ui/Bubble'
import { EvidenceMap } from '@/components/findings/EvidenceMap'
import { companies } from '@/lib/data/companies'
import { getFindingsForCompany } from '@/lib/data/findings'
import type { BubbleKey } from '@/types/company'

export default async function FindingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const company = companies.find((c) => c.id === id)
  if (!company) notFound()

  const findings = getFindingsForCompany(id)
  const companyActions = company.actions?.filter((a) => !a.isOwnerAction) ?? []
  const ownerActions = company.actions?.filter((a) => a.isOwnerAction) ?? []

  return (
    <div className="min-h-screen flex flex-col max-w-[430px] md:max-w-[860px] mx-auto pb-16">
      <TopBar showBack backHref={`/companies/${id}`} title={company.name} />

      {/* Evidence map */}
      {findings.length > 0 && (
        <EvidenceMap
          companyName={company.name}
          companyLogo={company.logo}
          companyLogoBg={company.logoBg}
          companyLogoCl={company.logoCl}
          companyLogoImg={company.logoImg}
          findings={findings}
        />
      )}

      <div className="flex-1 px-5 pt-4">
        {/* Company actions */}
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

        {/* Owner actions */}
        {ownerActions.length > 0 && (
          <>
            <p className="font-mono text-[10px] text-amber tracking-[1px] mb-2">OWNER ACTIONS</p>
            <div className="bg-white border border-border rounded-2xl overflow-hidden mb-4">
              {ownerActions.map((action, i) => (
                <div
                  key={action.id}
                  className={`px-4 py-3 border-l-[3px] border-amber ${
                    i < ownerActions.length - 1 ? 'border-b border-border' : ''
                  }`}
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

        {companyActions.length === 0 && ownerActions.length === 0 && findings.length === 0 && (
          <div className="text-center py-16 text-dim">
            <p className="font-mono text-[11px]">Documentation coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
