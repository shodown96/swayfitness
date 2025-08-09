import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: LucideIcon
  rightIcon?: () => React.ReactNode
  error?: any
  touched?: boolean
  label?: string
  containerClass?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon: LeftIcon, rightIcon, error, touched, label, containerClass = "", ...props }, ref) => {
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
          {LeftIcon && <LeftIcon className="absolute left-3 text-muted-foreground pointer-events-none" size={16} />}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              LeftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              className,
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && <div className="absolute right-3">{rightIcon()}</div>}
        </div>
        {touched && error && (
          <label className="text-xs text-red-500 absolute mt-1">
            {error?.message || typeof error === "string" ? error : null}
          </label>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
