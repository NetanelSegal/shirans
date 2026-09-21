import { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  /** For icon-only or short controls (accessibility). */
  ariaLabel?: string
}

const variantClasses = {
  primary: 'bg-primary text-on-dark hover-capable:hover:bg-primary/90',
  secondary: 'bg-surface-sunken text-ink hover-capable:hover:bg-surface-sunken/80',
  danger: 'bg-danger text-on-dark hover-capable:hover:bg-danger',
  success: 'bg-success text-on-dark hover-capable:hover:bg-success/90',
  warning: 'bg-warning text-on-dark hover-capable:hover:bg-warning/90',
  info: 'bg-primary text-on-dark hover-capable:hover:bg-primary/90',
  light: 'bg-surface-sunken text-ink hover-capable:hover:bg-surface-sunken',
  dark: 'bg-primary text-on-dark hover-capable:hover:bg-primary',
};

function Button({ children, onClick, variant = 'secondary', className, disabled, type = 'button', ariaLabel }: ButtonProps) {
  return (
    <button
      className={`rounded-card px-4 py-2 transition-all duration-200 ${variantClasses[variant]} ${className ?? ''}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export default Button