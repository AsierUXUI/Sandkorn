'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  {
    href: '/',
    label: 'Boycott',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <line x1="12" y1="3" x2="12" y2="21" strokeWidth="1.6"/>
        <path d="M8 6.5c1.2-.8 5.8-.8 7 0" strokeLinecap="round"/>
        <path d="M6.5 12c.8 2.4 4 4 5.5 4s4.7-1.6 5.5-4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/companies',
    label: 'Discover',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/me',
    label: 'Profile',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-[200] h-16 items-center px-10 bg-bg/97 backdrop-blur-[14px] border-b border-border">
      <Link href="/" className="font-syne font-extrabold text-[20px] tracking-[-0.6px] text-text no-underline mr-auto">
        sandkorn
      </Link>
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-[7px] px-[18px] py-2 rounded-[9px] font-mono text-[13px] tracking-[.1px] no-underline transition-all ${
                isActive
                  ? 'bg-text text-white'
                  : 'text-mid hover:bg-bg'
              }`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
