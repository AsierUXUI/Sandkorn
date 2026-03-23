import type { Alternative } from '@/types/alternative'

interface AlternativeCardProps {
  alt: Alternative
  /** Show a divider below (for list use). Default true. */
  divider?: boolean
}

export function AlternativeCard({ alt, divider = true }: AlternativeCardProps) {
  return (
    <a
      href={alt.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-start gap-3 px-4 py-3.5 no-underline text-text hover:bg-bg transition-colors ${
        divider ? 'border-b border-border last:border-b-0' : ''
      }`}
    >
      {/* Logo */}
      <div
        className="w-10 h-10 rounded-[10px] flex items-center justify-center font-mono font-bold text-[11px] flex-shrink-0 mt-0.5"
        style={{ background: alt.logoBg, color: alt.logoCl }}
      >
        {alt.logo}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-syne font-bold text-[15px]">{alt.name}</span>
          <span className="font-mono text-[9px] text-dim">{alt.sub}</span>
        </div>
        <p className="text-[12px] text-mid leading-relaxed mb-1.5">{alt.description}</p>
        {/* Tags */}
        <div className="flex gap-1 flex-wrap">
          {alt.danish && <Tag label="Dansk" color="teal" />}
          {alt.eu && !alt.danish && <Tag label="EU" color="teal" />}
          {alt.free && <Tag label="Gratis" color="default" />}
          {alt.openSource && <Tag label="Open source" color="default" />}
        </div>
      </div>

      {/* Arrow */}
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-dim flex-shrink-0 mt-1.5"
      >
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </a>
  )
}

function Tag({ label, color }: { label: string; color: 'teal' | 'default' }) {
  if (color === 'teal') {
    return (
      <span className="font-mono text-[8px] tracking-[.3px] px-1.5 py-0.5 rounded-full bg-teal-bg text-teal border border-teal-border">
        {label}
      </span>
    )
  }
  return (
    <span className="font-mono text-[8px] tracking-[.3px] px-1.5 py-0.5 rounded-full bg-bg text-dim border border-border">
      {label}
    </span>
  )
}
