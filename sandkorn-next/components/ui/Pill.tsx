'use client'

interface PillProps {
  label: string
  active?: boolean
  onClick?: () => void
}

export function Pill({ label, active, onClick }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border font-mono text-[11px] whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
        active
          ? 'bg-teal text-white border-teal'
          : 'bg-white text-mid border-border'
      }`}
    >
      {label}
    </button>
  )
}
