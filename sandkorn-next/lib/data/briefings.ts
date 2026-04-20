export interface BriefingBeat {
  id: string
  headline: string
  body: string
  source?: string
  sourceUrl?: string
}

export interface BoycottBriefing {
  boycottId: string
  beats: BriefingBeat[]
}

export const briefings: BoycottBriefing[] = [
  {
    boycottId: 'boycott-wolt-apr-2026',
    beats: [
      {
        id: 'wolt-1',
        headline: '1,500 couriers. Zero rights.',
        body: "Wolt has around 1,500 couriers in Copenhagen. They are all classified as 'independent partners' — which means no sick pay, no holiday pay, no pension, and no guaranteed minimum wage.",
        source: 'Fagbladet 3F, 2023',
      },
      {
        id: 'wolt-2',
        headline: 'Working 100+ hours a week.',
        body: "Wolt's own data revealed around 300 cases where a courier apparently worked over 100 hours in a single week. That's only possible if multiple people share one account — which is illegal.",
        source: 'Fagbladet 3F, Sep 2023',
      },
      {
        id: 'wolt-3',
        headline: 'The state agrees: these are employees.',
        body: 'The Danish Tax Council ruled that Wolt couriers must be treated as employees for tax purposes. Wolt now withholds tax — but still denies couriers holiday pay, ATP, and sick pay.',
        source: 'Skatterådet / WageIndicator, May 2023',
      },
      {
        id: 'wolt-4',
        headline: 'A lawsuit that could change everything.',
        body: 'The Courier Association of Denmark is suing Wolt at Copenhagen City Court, demanding back-pay for holiday pay and ATP contributions. The case could set a precedent for all gig workers in Denmark.',
        source: 'Solidaritet.dk, Jan 2025',
      },
      {
        id: 'wolt-5',
        headline: 'Behind Wolt: DoorDash.',
        body: "Wolt was acquired by American delivery giant DoorDash in 2022 for €7 billion. DoorDash has a long history of fighting worker classification in the US. The pattern is the same.",
        source: 'Financial Times, Nov 2022',
      },
      {
        id: 'wolt-6',
        headline: 'Your order has a hidden cost.',
        body: "Every time you order through Wolt, you're paying someone who can't afford to get sick. A boycott puts pressure where it counts — on revenue.",
      },
      {
        id: 'wolt-7',
        headline: 'Join 312 people saying no.',
        body: "This month, 312 people in Denmark have committed to boycotting Wolt. Each grain you add makes the pile visible. Small actions, together, become something Wolt can't ignore.",
      },
    ],
  },
]

export function getBriefing(boycottId: string): BoycottBriefing | undefined {
  return briefings.find((b) => b.boycottId === boycottId)
}
