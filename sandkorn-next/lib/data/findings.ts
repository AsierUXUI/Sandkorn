import type { Finding } from '@/types/finding'

const woltFindings: Finding[] = [
  // ── Verified (inner ring) ──────────────────────────────────────────────────
  {
    id: 'wolt-3f-lawsuit',
    companyId: 'wolt',
    headline: '3F files lawsuit over worker classification',
    body: 'Danish trade union 3F filed suit against Wolt, arguing that delivery workers meet every legal criterion for employment — entitling them to sick pay, holiday allowance, and union rights. The case is ongoing in Copenhagen City Court.',
    source: '3F / Fagbladet',
    sourceUrl: 'https://fagbladet3f.dk',
    date: '2024-09-12',
    ring: 'verified',
    impactTag: 'labour',
  },
  {
    id: 'wolt-self-employed-ruling',
    companyId: 'wolt',
    headline: 'Workers denied sick pay despite fixed schedules',
    body: 'An internal Wolt contract analysis published by Arbejdstilsynet found that couriers with fixed weekly slots are classified as independent contractors yet operate under conditions indistinguishable from employment, denying them statutory benefits.',
    source: 'Arbejdstilsynet',
    sourceUrl: 'https://at.dk',
    date: '2024-06-03',
    ring: 'verified',
    impactTag: 'labour',
  },
  // ── Reported (middle ring) ─────────────────────────────────────────────────
  {
    id: 'wolt-doordash-lobby',
    companyId: 'wolt',
    headline: 'Parent DoorDash lobbied against EU gig-worker protections',
    body: 'Following DoorDash\'s 2022 acquisition of Wolt, the parent company joined a US tech coalition pushing back on the EU Platform Work Directive, which would have reclassified millions of gig workers as employees.',
    source: 'Politico EU',
    sourceUrl: 'https://politico.eu',
    date: '2023-11-20',
    ring: 'reported',
    impactTag: 'pol',
  },
  {
    id: 'wolt-data-sharing',
    companyId: 'wolt',
    headline: 'Order and location data shared with DoorDash analytics',
    body: 'Wolt\'s updated privacy policy (post-acquisition) confirms that order history, precise location trails, and device identifiers are shared with DoorDash\'s global data infrastructure for "service improvement and advertising."',
    source: 'Wolt Privacy Policy / Forbrugerrådet Tænk',
    date: '2023-04-01',
    ring: 'reported',
    impactTag: 'data',
  },
  // ── Community (outer ring) ─────────────────────────────────────────────────
  {
    id: 'wolt-winter-conditions',
    companyId: 'wolt',
    headline: 'Couriers report no winter equipment support',
    body: 'Multiple Copenhagen couriers report being required to work in sub-zero conditions with no equipment allowance, despite Wolt\'s terms requiring couriers to maintain their own bikes and gear year-round.',
    source: 'Community submission',
    date: '2024-01-15',
    ring: 'community',
    impactTag: 'labour',
  },
  {
    id: 'wolt-tip-opacity',
    companyId: 'wolt',
    headline: 'Couriers say tips do not fully reach them',
    body: 'Several drivers report that in-app tips are pooled or offset against base pay, though Wolt\'s public messaging implies tips go directly to the individual courier. No independent audit has been published.',
    source: 'Community submission',
    date: '2025-02-08',
    ring: 'community',
    impactTag: 'labour',
  },
]

const allFindings: Finding[] = [...woltFindings]

export function getFindingsForCompany(companyId: string): Finding[] {
  return allFindings.filter((f) => f.companyId === companyId)
}

export function getFindingsByRing(companyId: string) {
  const findings = getFindingsForCompany(companyId)
  return {
    verified: findings.filter((f) => f.ring === 'verified'),
    reported: findings.filter((f) => f.ring === 'reported'),
    community: findings.filter((f) => f.ring === 'community'),
  }
}
