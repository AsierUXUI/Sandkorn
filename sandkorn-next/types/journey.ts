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

// ─── New journey config model ───────────────────────────────────────────────

export type NodeType =
  | 'share'
  | 'delete_app'
  | 'find_alternative'
  | 'send_gdpr'
  | 'hold'
  | 'read_finding'
  | 'custom'

export interface JourneyNode {
  id: string
  type: NodeType
  label: string
  description: string
  grains: number
  timing: string        // e.g. "Day 0", "This week", "Week 1–2"
  isMilestone?: boolean
  actionLabel?: string
  actionHref?: string   // relative href from the journey page
  socialCount: number   // people who completed this node — swap for Supabase later
}

export interface JourneyConfig {
  companyId: string
  totalGrains: number   // fixed at creation: sum of all node grains
  nodes: JourneyNode[]  // ordered top (first action) to bottom (milestone)
}

export type NodeState = 'completed' | 'active' | 'upcoming' | 'holding'
