export type JourneyPhaseKey = 'grain' | 'cut' | 'discover' | 'settle' | 'clean'

export interface JourneyPhase {
  key: JourneyPhaseKey
  step: number
  label: string       // 'STEP 1' … 'STEP 5'
  week: string        // 'Day 0' | 'This week' | 'Week 1–2' | 'Week 4' | 'When ready'
  title: string
  icon: string
  description: string
  actionLabel?: string
  actionHref?: string // relative href from the journey page
  mockCount: number   // social proof — swap for Supabase later
}
