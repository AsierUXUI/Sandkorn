'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'

type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months:              'flex flex-col gap-4',
        month:               'flex flex-col gap-4',
        caption:             'flex justify-center pt-1 relative items-center w-full',
        caption_label:       'text-sm font-medium font-syne',
        nav:                 'flex items-center gap-1',
        nav_button:          'h-7 w-7 bg-transparent p-0 flex items-center justify-center rounded-lg border border-border opacity-50 hover:opacity-100 transition-opacity cursor-pointer',
        nav_button_previous: 'absolute left-1',
        nav_button_next:     'absolute right-1',
        table:               'w-full border-collapse',
        head_row:            'flex',
        head_cell:           'text-dim rounded-md w-8 font-mono text-[0.75rem] text-center',
        row:                 'flex w-full mt-2',
        cell:                cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
          '[&:has([aria-selected])]:bg-teal-bg first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
        ),
        day:                 'h-8 w-8 p-0 font-normal flex items-center justify-center rounded-md text-sm cursor-pointer hover:bg-teal-bg hover:text-teal transition-colors aria-selected:opacity-100',
        day_selected:        'bg-teal text-white hover:bg-teal-2 hover:text-white focus:bg-teal focus:text-white',
        day_today:           'bg-teal-bg text-teal font-semibold',
        day_outside:         'text-dim opacity-40',
        day_disabled:        'text-dim opacity-30 cursor-not-allowed',
        day_range_start:     'rounded-l-md bg-teal text-white',
        day_range_end:       'rounded-r-md bg-teal text-white',
        day_range_middle:    'bg-teal-bg text-teal rounded-none',
        day_hidden:          'invisible',
        ...classNames,
      }}
      components={{
        IconLeft:  () => <ChevronLeft  className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}

export { Calendar }
