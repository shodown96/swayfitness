import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: any
  touched?: boolean
  label?: string
  containerClass?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, touched, label, containerClass = "", ...props }, ref) => {
    return (
      <div className={containerClass}>
        {label && <p className="text-sm font-medium w-full text-left mb-1">{label}</p>}
        <div
          className={cn(
            "relative border border-input shadow-xs transition-all rounded-md",
            "focus-within:outline-none focus-within:ring-0 focus-within:ring-primary focus-within:border-primary",
            touched && error ? "!outline-red-500 ring-[0.5px] ring-red-500 !border-red-500" : "",
          )}
        >
          <textarea
            className={cn(
              "w-full text-base md:text-sm outline-none bg-transparent px-4 py-[10px] resize-none",
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
        {touched && error && (
          <label className="text-xs text-red-500 absolute mt-[2px]">
            {error?.message || typeof error === "string" ? error : null}
          </label>
        )}
      </div>
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
