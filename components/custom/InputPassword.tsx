"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input, type InputProps } from "./Input"

interface InputPasswordProps extends Omit<InputProps, "type" | "rightIcon"> {}

function InputPassword({ ...props }: InputPasswordProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const PasswordIcon = showPassword ? EyeOff : Eye

  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      rightIcon={() => (
        <PasswordIcon
          className="cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          onClick={togglePasswordVisibility}
        />
      )}
    />
  )
}

export { InputPassword }
