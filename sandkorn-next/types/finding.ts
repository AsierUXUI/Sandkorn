import type { BubbleKey } from './company'

export type RingLevel = 'verified' | 'reported' | 'community'

export interface Finding {
  id: string
  companyId: string
  headline: string
  body: string
  source: string
  sourceUrl?: string
  date: string        // YYYY-MM-DD
  ring: RingLevel
  impactTag: BubbleKey
}
