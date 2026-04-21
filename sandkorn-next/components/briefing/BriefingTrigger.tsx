'use client'

import { useState, useCallback } from 'react'
import { BoycottBriefing } from './BoycottBriefing'
import { getBriefing } from '@/lib/data/briefings'

interface BriefingTriggerProps {
  boycottId: string
  companyId: string
  source: 'landing' | 'dossier'
  children: React.ReactNode
}

// v2 key — previous key may be set from earlier builds
const SEEN_KEY = (id: string) => `boycott-flow-seen-v2-${id}`

function navigate(path: string) {
  // next.config basePath is /Sandkorn — prepend it for window.location
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  window.location.href = base + path
}

export function BriefingTrigger({ boycottId, companyId, source, children }: BriefingTriggerProps) {
  const [showBriefing, setShowBriefing] = useState(false)
  const briefing = getBriefing(boycottId)

  const hasSeen = () => !!localStorage.getItem(SEEN_KEY(boycottId))

  const markSeen = useCallback(() => {
    if (!localStorage.getItem(SEEN_KEY(boycottId))) {
      localStorage.setItem(SEEN_KEY(boycottId), '1')
    }
  }, [boycottId])

  const handleClick = useCallback(() => {
    if (!briefing) return
    if (source === 'landing' && hasSeen()) {
      navigate(`/companies/${companyId}`)
    } else {
      setShowBriefing(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [briefing, boycottId, companyId, source])

  const handleComplete = useCallback(() => {
    markSeen()
    setShowBriefing(false)
    if (source === 'landing') {
      navigate(`/companies/${companyId}/journey`)
    }
    // dossier: close overlay, stay on dossier
  }, [source, markSeen, companyId])

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
