export interface Banner {
  id: string
  type: 'action' | 'event'
  active: boolean
  variant: 'eu' | 'event'
  label: string
  title: string
  subtitle?: string
  description: string
  cta: string
  href: string
  external?: boolean
}

export const banners: Banner[] = [
  {
    id: 'eu-initiative-2025',
    type: 'action',
    active: true,
    variant: 'eu',
    label: "EUROPEAN CITIZENS' INITIATIVE · SIGN NOW",
    title: 'Stop funding Big Tech with public money',
    description: 'An EU-wide petition demanding governments stop buying services from companies that exploit citizens. 1 million signatures triggers a European law.',
    cta: 'Sign the initiative →',
    href: 'https://citizens-initiative.europa.eu/initiatives/details/2025/000002_en',
    external: true,
  },
  {
    id: 'event-leaving-meta',
    type: 'event',
    active: true,
    variant: 'event',
    label: 'COMMUNITY EVENT · JOIN NOW',
    title: 'Leaving Meta Together',
    subtitle: '📍 Café Blågård, Nørrebro · Thu 27 Mar, 19:00',
    description: 'A guided session where you migrate your photos, contacts and history — with others making the same move. Explore alternatives side by side.',
    cta: 'See event details →',
    href: '#',
  },
]

/** Boycott page: action > event */
export function getBannerForBoycottPage(): Banner | null {
  return (
    banners.find((b) => b.type === 'action' && b.active) ??
    banners.find((b) => b.type === 'event' && b.active) ??
    null
  )
}

/** Explore page: event > action */
export function getBannerForExplorePage(): Banner | null {
  return (
    banners.find((b) => b.type === 'event' && b.active) ??
    banners.find((b) => b.type === 'action' && b.active) ??
    null
  )
}
