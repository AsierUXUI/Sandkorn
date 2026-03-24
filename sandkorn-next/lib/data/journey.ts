import type { JourneyPhase } from '@/types/journey'

export const JOURNEY_PHASES: JourneyPhase[] = [
  {
    key: 'grain',
    step: 1,
    label: 'STEP 1',
    week: 'Day 0',
    title: "You're in",
    icon: '🌾',
    description:
      "You committed. That's the hardest part. Systems are designed to make staying easy — you just made leaving real.",
    mockCount: 12400,
  },
  {
    key: 'cut',
    step: 2,
    label: 'STEP 2',
    week: 'This week',
    title: 'Delete the app',
    icon: '✂️',
    description:
      "Remove it from your device. It takes 10 minutes — and that's exactly what they're counting on you never finding.",
    mockCount: 8300,
  },
  {
    key: 'discover',
    step: 3,
    label: 'STEP 3',
    week: 'Week 1–2',
    title: 'Try the alternative',
    icon: '🔄',
    description:
      "The alternatives exist and they're good. Try one this week. Different isn't worse — it's just new.",
    actionLabel: 'See alternatives →',
    actionHref: '../',
    mockCount: 4600,
  },
  {
    key: 'settle',
    step: 4,
    label: 'STEP 4',
    week: 'Week 4',
    title: 'Hold the line',
    icon: '🌱',
    description:
      'The first 30 days are the hardest. Each day you stay, the habit builds and the old pull weakens.',
    mockCount: 1900,
  },
  {
    key: 'clean',
    step: 5,
    label: 'STEP 5',
    week: 'When ready',
    title: 'Wipe your data',
    icon: '📄',
    description:
      'A GDPR request forces them to erase your ad profile, shadow profile, and everything shared — they must respond within 30 days.',
    actionLabel: 'Generate GDPR email →',
    actionHref: '/gdpr',
    mockCount: 720,
  },
]

export function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k'
  return String(n)
}
