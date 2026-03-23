export interface Boycott {
  id: string
  companyId: string
  startDate: string   // YYYY-MM-DD
  endDate: string     // YYYY-MM-DD
  goal: number        // grain goal for the month
  grains: number      // dk-wide count (static until Supabase)
  cityGrains: number  // city-level count
  yourGrains: number  // user count (static until auth)
  tagline: string     // shown on home card
}
