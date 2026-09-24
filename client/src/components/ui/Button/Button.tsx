import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { buttonStyles, ButtonSize, ButtonVariant } from './buttonStyles';

interface CommonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** The trailing "forward" arrow. Points left, the reading direction in RTL. */
  arrow?: boolean;
  className?: string;
}

function Content({ children, arrow }: Pick<CommonProps, 'children' | 'arrow'>) {
  return (
    <>
      {children}
      {arrow && <ArrowLeft className='size-[1.1em] shrink-0' strokeWidth={1.75} aria-hidden />}
    </>
  );
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    /** @deprecated use aria-label */
    ariaLabel?: string;
  };

/** An action. For navigation use <ButtonLink>. */
function Button({
  children,
  variant = 'primary',
  size,
  fullWidth,
  arrow,
  className,
  type = 'button',
  ariaLabel,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={buttonStyles({ variant, size, fullWidth, className })}
      {...rest}
    >
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}

type ButtonLinkProps = CommonProps & Omit<LinkProps, 'children' | 'className'>;

/** Navigation that looks like a button. External URLs open in a new tab. */
export function ButtonLink({
  children,
  variant = 'primary',
  size,
  fullWidth,
  arrow,
  className,
  to,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonStyles({ variant, size, fullWidth, className });
  if (typeof to === 'string' && /^(https?:|tel:|mailto:)/.test(to)) {
    const external = to.startsWith('http');
    return (
      <a
        href={to}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(rest as object)}
      >
        <Content arrow={arrow}>{children}</Content>
      </a>
    );
  }
  return (
    <Link to={to} className={classes} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );
}

export default Button;
