'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// ─── Single date picker ────────────────────────────────────────────────────

interface DatePickerProps {
  value?:       Date
  onChange?:    (date: Date | undefined) => void
  placeholder?: string
  className?:   string
  disabled?:    boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Vælg en dato',
  className,
  disabled,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="soft"
          disabled={disabled}
          className={cn('justify-start text-left font-normal', !value && 'text-dim', className)}
        >
          <CalendarIcon className="h-4 w-4 shrink-0" />
          {value ? format(value, 'PPP', { locale: da }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={da}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ─── Date range picker ─────────────────────────────────────────────────────

interface DateRangePickerProps {
  value?:       DateRange
  onChange?:    (range: DateRange | undefined) => void
  placeholder?: string
  className?:   string
  disabled?:    boolean
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Vælg periode',
  className,
  disabled,
}: DateRangePickerProps) {
  const label = value?.from
    ? value.to
      ? `${format(value.from, 'd. MMM', { locale: da })} – ${format(value.to, 'd. MMM yyyy', { locale: da })}`
      : format(value.from, 'PPP', { locale: da })
    : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="soft"
          disabled={disabled}
          className={cn('justify-start text-left font-normal', !value?.from && 'text-dim', className)}
        >
          <CalendarIcon className="h-4 w-4 shrink-0" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          locale={da}
          numberOfMonths={1}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ─── Date picker with presets ──────────────────────────────────────────────

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addDays, startOfMonth, subMonths } from 'date-fns'

const PRESETS = [
  { label: 'I dag',         getValue: () => new Date() },
  { label: 'Om 7 dage',     getValue: () => addDays(new Date(), 7) },
  { label: 'Om 30 dage',    getValue: () => addDays(new Date(), 30) },
  { label: 'Denne måned',   getValue: () => startOfMonth(new Date()) },
  { label: 'Sidste måned',  getValue: () => startOfMonth(subMonths(new Date(), 1)) },
] as const

interface DatePickerWithPresetsProps extends DatePickerProps {}

export function DatePickerWithPresets({
  value,
  onChange,
  placeholder = 'Vælg en dato',
  className,
  disabled,
}: DatePickerWithPresetsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="soft"
          disabled={disabled}
          className={cn('justify-start text-left font-normal', !value && 'text-dim', className)}
        >
          <CalendarIcon className="h-4 w-4 shrink-0" />
          {value ? format(value, 'PPP', { locale: da }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="border-b border-border p-3">
          <Select onValueChange={(v) => onChange?.(PRESETS[Number(v)].getValue())}>
            <SelectTrigger>
              <SelectValue placeholder="Hurtigvalg…" />
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((preset, i) => (
                <SelectItem key={preset.label} value={String(i)}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={da}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
