"use client"

import type * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  onBlur?: (e: React.FocusEvent) => void
  placeholder?: string
  error?: any
  touched?: boolean
  label?: string
  containerClass?: string
  name?: string
}

function Select({
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Select an option",
  error,
  touched,
  label,
  containerClass = "",
  name,
}: SelectProps) {
  return (
    <div className={containerClass}>
      {label && <p className="text-sm font-medium w-full text-left mb-1">{label}</p>}
      <div
        className={cn(
          "relative flex items-center border border-input shadow-xs transition-all rounded-md",
          "focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary",
          touched && error ? "!outline-red-500 ring-[0.5px] ring-red-500 !border-red-500" : "",
        )}
      >
        <select
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          className={cn(
            "w-full text-base md:text-sm outline-none bg-transparent px-4 py-[10px] pr-10",
            "appearance-none cursor-pointer",
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 text-muted-foreground pointer-events-none" size={16} />
      </div>
      {touched && error && (
        <label className="text-xs text-red-500 absolute mt-[2px]">
          {error?.message || typeof error === "string" ? error : null}
        </label>
      )}
    </div>
  )
}

export { Select }
