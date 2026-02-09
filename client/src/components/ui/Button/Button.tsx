import React, { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const variantClasses = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-black',
  danger: 'bg-red-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-500 text-white',
  light: 'bg-gray-100 text-black',
  dark: 'bg-gray-800 text-white',
}

function Button({ children, variant = 'secondary', className, disabled, type = 'button' }: ButtonProps) {

  return (
    <button className={`rounded-xl px-4 py-2 text-black hover:bg-secondary/80 transition-all duration-200 ${variantClasses[variant]} ${className}`} disabled={disabled} type={type}>
      {children}
    </button>
  )
}

export default Button