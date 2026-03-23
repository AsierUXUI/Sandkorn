export type BubbleKey = 'war' | 'pol' | 'data' | 'labour' | 'env' | 'tax' | 'settler' | 'mis' | 'animal' | 'indig'
export type Category = 'social' | 'tech' | 'retail' | 'food' | 'finance'
export type Priority = 'high' | 'medium' | 'low'
export type ActionType = 'gdpr' | 'link' | 'finance'

export interface CompanyAction {
  id: string
  date: string
  source: string
  sourceUrl: string
  bubbles: BubbleKey[]
  text: string
  isOwnerAction?: boolean
  ownerName?: string
}

export interface Company {
  id: string
  name: string
  sub: string
  cat: Category
  priority: Priority
  deletions: number
  bubbles: BubbleKey[]
  logo: string
  logoImg: string
  logoBg: string
  logoCl: string
  isSaaS?: boolean
  actionType: ActionType
  isActiveBoycott?: boolean
  daysLeft?: number
  actions?: CompanyAction[]
  candidatePitch?: string  // one-liner shown on the "Vælg næste bojkot" card
}

export const BUBBLE_MAP: Record<BubbleKey, { cls: string; label: string }> = {
  war:     { cls: 'b-war',     label: 'War funding' },
  pol:     { cls: 'b-pol',     label: 'Political funding' },
  data:    { cls: 'b-data',    label: 'Data exploitation' },
  labour:  { cls: 'b-labour',  label: 'Labour violations' },
  env:     { cls: 'b-env',     label: 'Environmental damage' },
  tax:     { cls: 'b-tax',     label: 'Tax avoidance' },
  settler: { cls: 'b-settler', label: 'Settler economy' },
  mis:     { cls: 'b-mis',     label: 'Misinformation' },
  animal:  { cls: 'b-animal',  label: 'Animal welfare' },
  indig:   { cls: 'b-indig',   label: 'Indigenous rights' },
}

export const CAT_LABELS: Record<Category, string> = {
  social:  'Social',
  tech:    'Tech',
  retail:  'Retail',
  food:    'Food',
  finance: 'Finance',
}
