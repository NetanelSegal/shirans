import { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const variantClasses = {
  primary: 'bg-primary text-white hover-capable:hover:bg-primary/90',
  secondary: 'bg-secondary text-black hover-capable:hover:bg-secondary/80',
  danger: 'bg-red-500 text-white hover-capable:hover:bg-red-600',
  success: 'bg-green-500 text-white hover-capable:hover:bg-green-600',
  warning: 'bg-yellow-500 text-white hover-capable:hover:bg-yellow-600',
  info: 'bg-blue-500 text-white hover-capable:hover:bg-blue-600',
  light: 'bg-gray-100 text-black hover-capable:hover:bg-gray-200',
  dark: 'bg-gray-800 text-white hover-capable:hover:bg-gray-700',
};

function Button({ children, onClick, variant = 'secondary', className, disabled, type = 'button' }: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-4 py-2 transition-all duration-200 ${variantClasses[variant]} ${className ?? ''}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button