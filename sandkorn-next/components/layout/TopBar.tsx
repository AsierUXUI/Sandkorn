import Link from 'next/link'

interface TopBarProps {
  title?: string
  showBack?: boolean
  backHref?: string
  right?: React.ReactNode
}

export function TopBar({ title, showBack, backHref = '/', right }: TopBarProps) {
  return (
    <header className="md:hidden flex items-center justify-between px-5 py-3.5 sticky top-0 z-[100] bg-bg/96 backdrop-blur-[12px] border-b border-border/40">
      {showBack ? (
        <Link
          href={backHref}
          className="text-mid font-mono text-[13px] inline-flex items-center gap-1 no-underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          back
        </Link>
      ) : (
        <Link href="/" className="font-syne font-extrabold text-[19px] tracking-tight text-text no-underline">
          sandkorn
        </Link>
      )}

      {title && (
        <span className="font-syne font-bold text-sm absolute left-1/2 -translate-x-1/2">{title}</span>
      )}

      {right && <div>{right}</div>}
      {!right && <div className="w-9" />}
    </header>
  )
}
