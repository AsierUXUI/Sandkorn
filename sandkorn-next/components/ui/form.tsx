'use client'

import * as React from 'react'
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { cn } from '@/lib/utils'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName }

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)
  return { name: fieldContext.name, ...fieldState }
}

type FormItemContextValue = { id: string }

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('flex flex-col gap-1.5', className)} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { error } = useFormField()
  const { id }    = React.useContext(FormItemContext)
  return (
    <label
      htmlFor={id}
      className={cn('text-sm font-medium font-sans', error && 'text-warn', className)}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { error } = useFormField()
  const { id }    = React.useContext(FormItemContext)
  return <div id={id} aria-invalid={!!error} {...props} />
}

function FormDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs font-sans text-dim', className)} {...props} />
  )
}

function FormMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { error } = useFormField()
  const body      = error ? String(error.message) : children
  if (!body) return null
  return (
    <p className={cn('text-xs font-sans text-warn', className)} {...props}>
      {body}
    </p>
  )
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormField }
