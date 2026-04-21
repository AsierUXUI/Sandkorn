'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { BoycottBriefing } from './BoycottBriefing'
import { getBriefing } from '@/lib/data/briefings'

interface BriefingTriggerProps {
  boycottId: string
  companyId: string
  source: 'landing' | 'dossier'
  children: React.ReactNode
}

const SEEN_KEY = (id: string) => `briefing-seen-${id}`

export function BriefingTrigger({ boycottId, companyId, source, children }: BriefingTriggerProps) {
  const [showBriefing, setShowBriefing] = useState(false)
  const router = useRouter()
  const briefing = getBriefing(boycottId)

  const hasSeen = () =>
    typeof window !== 'undefined' && !!localStorage.getItem(SEEN_KEY(boycottId))

  const markSeen = useCallback(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(SEEN_KEY(boycottId))) {
      localStorage.setItem(SEEN_KEY(boycottId), '1')
    }
  }, [boycottId])

  const handleClick = useCallback(() => {
    if (!briefing) return
    if (source === 'landing' && hasSeen()) {
      router.push(`/companies/${companyId}`)
    } else {
      setShowBriefing(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [briefing, boycottId, companyId, source, router])

  const handleComplete = useCallback(() => {
    markSeen()
    setShowBriefing(false)
    if (source === 'landing') {
      router.push(`/companies/${companyId}/journey`)
    }
    // dossier: close overlay, stay on dossier
  }, [source, markSeen, companyId, router])

  const handleDismiss = useCallback(() => {
    setShowBriefing(false)
  }, [])

  if (!briefing) return <>{children}</>

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      {showBriefing && (
        <BoycottBriefing
          briefing={briefing}
          onComplete={handleComplete}
          onDismiss={handleDismiss}
          skipBehavior={source === 'landing' ? 'last-slide' : 'dismiss'}
        />
      )}
    </>
  )
}
