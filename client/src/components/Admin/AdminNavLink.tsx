import { NavLink } from 'react-router-dom';
import type { AdminNavItem } from './adminNavItems';

export function AdminNavLink({ to, label, icon, end }: AdminNavItem) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `mx-2 flex items-center gap-3 rounded-card p-4 transition-colors duration-200 hover:bg-primary/80 ${
            isActive ? 'bg-surface-sunken font-bold text-ink' : 'text-on-dark'
          }`
        }
      >
        <i className={`fa-solid ${icon}`} aria-hidden />
        <span>{label}</span>
      </NavLink>
    </li>
  );
}
