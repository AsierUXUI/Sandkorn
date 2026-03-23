import type { Boycott } from '@/types/boycott'

export const boycotts: Boycott[] = [
  {
    id: 'boycott-meta-jan-2026',
    companyId: 'meta',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    goal: 4500,
    grains: 9284,
    cityGrains: 1247,
    yourGrains: 3,
    tagline: 'Stop med at fodre algoritmen',
  },
  {
    id: 'boycott-amazon-feb-2026',
    companyId: 'amazon',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    goal: 3500,
    grains: 6821,
    cityGrains: 934,
    yourGrains: 2,
    tagline: 'Køb lokalt, tænk globalt',
  },
  {
    id: 'boycott-google-mar-2026',
    companyId: 'google',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    goal: 4000,
    grains: 3102,
    cityGrains: 412,
    yourGrains: 1,
    tagline: 'Tag din data tilbage',
  },
]

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
