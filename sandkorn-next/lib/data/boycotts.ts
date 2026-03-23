import type { Boycott } from '@/types/boycott'

export const boycotts: Boycott[] = [
  {
    id: 'boycott-wolt-mar-2026',
    companyId: 'wolt',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    goal: 2000,
    grains: 312,
    cityGrains: 187,
    yourGrains: 1,
    tagline: 'Din levering koster mere end du tror',
  },
]

/**
 * The three companies proposed as candidates for next month's boycott.
 * Users will eventually vote on these — for now it's static.
 */
export const nextBoycottCandidates = ['netto', 'arla', 'bestseller']

/** Returns the boycott active on a given date (defaults to today). */
export function getActiveBoycott(date = new Date()): Boycott | undefined {
  const d = date.toISOString().split('T')[0]
  return boycotts.find((b) => b.startDate <= d && b.endDate >= d)
}

/** Returns all past boycotts (ended before today). */
export function getPastBoycotts(date = new Date()): Boycott[] {
  const d = date.toISOString().split('T')[0]
  return boycotts.filter((b) => b.endDate < d)
}
