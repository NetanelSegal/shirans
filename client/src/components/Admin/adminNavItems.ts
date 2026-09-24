export interface AdminNavItem {
  to: string;
  label: string;
  /** Font Awesome class, matching the icon set the admin already loads. */
  icon: string;
  /** Only the overview should match on its prefix alone. */
  end?: boolean;
}

/**
 * The sidebar as data.
 *
 * It used to be nine copies of the same markup, and one of them pointed at a
 * route that had been deleted — a dead link is easy to miss in the eighth
 * repetition of an eight-line block and impossible to miss in a list.
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { to: '/admin', label: 'סקירה כללית', icon: 'fa-home', end: true },
  { to: '/admin/projects', label: 'פרויקטים', icon: 'fa-folder' },
  { to: '/admin/categories', label: 'קטגוריות', icon: 'fa-tags' },
  { to: '/admin/articles', label: 'מאמרים', icon: 'fa-newspaper' },
  { to: '/admin/testimonials', label: 'המלצות', icon: 'fa-star' },
  { to: '/admin/contacts', label: 'פניות צור קשר', icon: 'fa-envelope' },
  { to: '/admin/users', label: 'משתמשים', icon: 'fa-users' },
  { to: '/admin/calculator-leads', label: 'לידים מהמחשבון', icon: 'fa-list' },
  { to: '/admin/calculator-config', label: 'הגדרות המחשבון', icon: 'fa-gear' },
];
