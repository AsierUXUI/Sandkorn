'use client'

import Image from 'next/image'
import { useState } from 'react'

interface CompanyLogoImageProps {
  src: string
  alt: string
  fallback: string
  bg: string
  cl: string
}

export function CompanyLogoImage({ src, alt, fallback, bg, cl }: CompanyLogoImageProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className="w-12 h-12 rounded-[12px] flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden"
      style={{ background: bg, color: cl }}
    >
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          width={48}
          height={48}
          className="w-full h-full object-contain p-1"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  )
}
