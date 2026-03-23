export interface Alternative {
  id: string
  name: string
  sub: string           // short subtitle / category label
  description: string   // 1–2 sentences in Danish
  url: string
  logo: string          // letter fallback
  logoBg: string
  logoCl: string
  replacesIds: string[] // company ids this replaces
  free?: boolean
  openSource?: boolean
  danish?: boolean      // Danish company
  eu?: boolean          // EU-based (but not Danish)
}
