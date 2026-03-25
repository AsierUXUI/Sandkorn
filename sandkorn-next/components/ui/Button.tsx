import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'flex items-center justify-center gap-2 rounded-xl cursor-pointer font-sans text-sm font-medium transition-all w-full',
  {
    variants: {
      variant: {
        teal:  'bg-teal text-white px-5 py-3',
        dark:  'bg-text text-white px-5 py-3',
        soft:  'bg-bg text-mid border border-border px-5 py-3',
        ghost: 'bg-transparent text-teal border border-teal-border text-[13px] py-2.5 px-4',
      },
    },
    defaultVariants: {
      variant: 'teal',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, asChild = false, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn(buttonVariants({ variant }), className)} {...props}>
      {children}
    </Comp>
  )
}

export { buttonVariants }
