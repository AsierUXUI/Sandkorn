interface ButtonProps {
  children: React.ReactNode
  variant?: 'teal' | 'dark' | 'soft' | 'ghost'
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}

export function Button({ children, variant = 'teal', onClick, type = 'button', className = '' }: ButtonProps) {
  const variants = {
    teal:  'bg-teal text-white',
    dark:  'bg-text text-white',
    soft:  'bg-bg text-mid border border-border',
    ghost: 'bg-transparent text-teal border border-teal-border text-[13px] py-2.5 px-4',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-none cursor-pointer font-sans text-sm font-medium transition-all w-full ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
