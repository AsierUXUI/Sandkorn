import type { JourneyConfig } from '@/types/journey'

const woltJourney: JourneyConfig = {
  companyId: 'wolt',
  totalGrains: 29,
  nodes: [
    {
      id: 'wolt-share',
      type: 'share',
      label: 'Share the boycott',
      description:
        'Tell one person. Post it. The pile grows when others join — and they join when someone tells them.',
      grains: 1,
      timing: 'Day 0',
      socialCount: 12400,
      actionLabel: 'Share →',
      actionHref: '#share',
    },
    {
      id: 'wolt-delete',
      type: 'delete_app',
      label: 'Delete the app',
      description:
        'Remove Wolt from your device. It takes two taps — and that friction is exactly what they count on.',
      grains: 4,
      timing: 'This week',
      socialCount: 8300,
    },
    {
      id: 'wolt-alternative',
      type: 'find_alternative',
      label: 'Try Hungry.dk',
      description:
        'Order once from Hungry.dk this week. Danish-owned, same convenience. Different isn\'t worse — it\'s just new.',
      grains: 6,
      timing: 'Week 1–2',
      socialCount: 4600,
      actionLabel: 'See alternatives →',
      actionHref: '../#alternatives',
    },
    {
      id: 'wolt-hold',
      type: 'hold',
      label: 'Hold the line',
      description:
        'The first 30 days reshape the habit. Each day you stay, the old pull weakens. You + thousands are holding right now.',
      grains: 8,
      timing: 'Week 4',
      socialCount: 1900,
    },
    {
      id: 'wolt-gdpr',
      type: 'send_gdpr',
      label: 'Wipe your data',
      description:
        'A GDPR request forces Wolt to erase your ad profile, shadow profile, and everything shared with DoorDash. They must respond within 30 days.',
      grains: 10,
      timing: 'When ready',
      isMilestone: true,
      socialCount: 720,
      actionLabel: 'Generate GDPR email →',
      actionHref: '../gdpr',
    },
  ],
}

const journeyConfigs: JourneyConfig[] = [woltJourney]

export function getJourneyConfig(companyId: string): JourneyConfig | undefined {
  return journeyConfigs.find((j) => j.companyId === companyId)
}
