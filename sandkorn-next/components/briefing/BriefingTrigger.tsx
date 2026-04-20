'use client'

import { useState, useCallback } from 'react'
import { BoycottBriefing } from './BoycottBriefing'
import { getBriefing } from '@/lib/data/briefings'

interface BriefingTriggerProps {
  boycottId: string
  journeyHref: string
  children: React.ReactNode
}

const SEEN_KEY = (id: string) => `briefing-seen-${id}`

export function BriefingTrigger({ boycottId, journeyHref, children }: BriefingTriggerProps) {
  const [showBriefing, setShowBriefing] = useState(false)
  const briefing = getBriefing(boycottId)

  const handleClick = useCallback(() => {
    if (!briefing) return
    const seen = typeof window !== 'undefined' && localStorage.getItem(SEEN_KEY(boycottId))
    if (seen) {
      window.location.href = journeyHref
    } else {
      setShowBriefing(true)
    }
  }, [briefing, boycottId, journeyHref])

  const handleClose = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SEEN_KEY(boycottId), '1')
    }
    setShowBriefing(false)
  }, [boycottId])

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      {showBriefing && briefing && (
        <BoycottBriefing
          briefing={briefing}
          journeyHref={journeyHref}
          onClose={handleClose}
        />
      )}
    </>
  )
}
