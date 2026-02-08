I have created the following plan after thorough exploration and analysis of the codebase. Follow the below plan verbatim. Trust the files and references. Do not re-verify what's written in the plan. Explore only when absolutely necessary. First implement all the proposed file changes and then I'll review all the changes together at the end.

## Observations

The codebase uses React Router v6 with lazy loading, TailwindCSS for styling, and Motion library for animations. Authentication is handled via `AuthContext` with role-based access control (`ADMIN`/`USER`). The site is RTL-oriented (Hebrew) with consistent design patterns including custom spacing utilities (`px-page-all`), color scheme (primary: #152b44, secondary: #F2EDE9), and `EnterAnimation` wrapper for smooth transitions. The `ProtectedRoute` component supports `requireAdmin` prop for admin-only routes.

## Approach

Create a separate admin dashboard layout distinct from the public site layout, with a sidebar navigation and top navbar. Use nested routing under `/admin` path with `ProtectedRoute` wrapper requiring admin role. Follow existing patterns for styling (TailwindCSS utilities), animations (Motion library), and RTL support. The admin layout will be independent of the main `Layout` component to provide a dedicated admin experience with its own navigation structure.

## Implementation Steps

### 1. Create Admin Dashboard Main Page

**File**: `file:client/src/pages/Admin/Dashboard.tsx`

Create the main admin dashboard page that will serve as the container for all admin routes:

- Import `Outlet` from `react-router-dom` to render nested routes
- Import `AdminLayout` component (to be created)
- Wrap content with `AdminLayout` component
- Use `Suspense` with `Loader` component for lazy-loaded nested routes
- Add `dir="rtl"` for RTL support
- Add Helmet for SEO with admin-specific title

### 2. Create Admin Layout Component

**File**: `file:client/src/components/Admin/AdminLayout.tsx`

Build the admin layout shell with sidebar and main content area:

- Create a flex container with sidebar and main content sections
- Sidebar should be fixed on desktop, collapsible on mobile
- Use `bg-primary` for sidebar background to match site theme
- Main content area with `bg-gray-50` background
- Sidebar width: `w-64` on desktop, full width on mobile when open
- Include `AdminNavbar` component at the top of main content
- Render `children` prop in main content area
- Add responsive breakpoints using TailwindCSS (`lg:` prefix for desktop)
- Use state for mobile menu toggle
- Add smooth transitions for sidebar collapse/expand

**Sidebar Navigation Structure**:
- Logo/brand section at top
- Navigation links with icons (using FontAwesome):
  - Dashboard Overview (`/admin`) - icon: `fa-home`
  - Projects (`/admin/projects`) - icon: `fa-folder`
  - Categories (`/admin/categories`) - icon: `fa-tags`
  - Testimonials (`/admin/testimonials`) - icon: `fa-star`
  - Contact Submissions (`/admin/contacts`) - icon: `fa-envelope`
- Use `NavLink` from `react-router-dom` with active state styling
- Active link: `bg-secondary text-primary font-bold`
- Inactive link: `text-white hover:bg-primary/80`
- Add icons with `<i>` tags and FontAwesome classes

### 3. Create Admin Navbar Component

**File**: `file:client/src/components/Admin/AdminNavbar.tsx`

Build the top navbar for admin dashboard:

- Sticky navbar with `sticky top-0 z-40`
- Background: `bg-white shadow-md`
- Flex container with space-between alignment
- Left side: Mobile menu toggle button (hamburger icon)
- Right side: User info and logout button
- Display user name and role from `useAuth()` hook
- Logout button with `onClick` handler calling `logout()` from `useAuth()`
- User section: Avatar placeholder (circle with initials) + name + role badge
- Role badge: `bg-primary text-white text-xs px-2 py-1 rounded-full`
- Logout button: `bg-red-500 hover:bg-red-600 text-white`
- Add RTL support with `dir="rtl"`
- Responsive: Show hamburger only on mobile (`lg:hidden`)

### 4. Update App.tsx with Admin Routes

**File**: `file:client/src/App.tsx`

Add admin routes to the router configuration:

- Import `ProtectedRoute` component
- Import `Dashboard` component with lazy loading: `const Dashboard = lazy(() => import('./pages/Admin/Dashboard'))`
- Add new route object in `createBrowserRouter` array (outside main Layout):

```javascript
{
  path: '/admin',
  element: (
    <ProtectedRoute requireAdmin={true}>
      <Dashboard />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '',
      element: <div>Dashboard Overview Placeholder</div>
    },
    {
      path: 'projects',
      element: <div>Projects Management Placeholder</div>
    },
    {
      path: 'categories',
      element: <div>Categories Management Placeholder</div>
    },
    {
      path: 'testimonials',
      element: <div>Testimonials Management Placeholder</div>
    },
    {
      path: 'contacts',
      element: <div>Contact Submissions Placeholder</div>
    }
  ]
}
```

- Place this route at the same level as the main Layout route and auth routes
- Use placeholder components for now (will be replaced in subsequent phases)

### 5. Styling Guidelines

Follow these TailwindCSS patterns throughout admin components:

**Colors**:
- Primary actions: `bg-primary text-white` (#152b44)
- Secondary backgrounds: `bg-secondary` (#F2EDE9)
- Danger actions: `bg-red-500 hover:bg-red-600`
- Success actions: `bg-green-500 hover:bg-green-600`
- Neutral backgrounds: `bg-gray-50`, `bg-gray-100`

**Spacing**:
- Use `px-page-all` for horizontal padding on main containers
- Use `py-section-all` for vertical padding on sections
- Card padding: `p-4` or `p-6`
- Gap between elements: `gap-4` or `gap-6`

**Typography**:
- Page titles: `heading` class (text-4xl md:text-5xl lg:text-6xl)
- Section titles: `subheading` class (text-2xl md:text-3xl lg:text-4xl)
- Body text: `paragraph` class (text-lg leading-tight)
- Small text: `text-sm`

**Borders & Shadows**:
- Cards: `rounded-xl shadow-md`
- Buttons: `rounded-xl`
- Inputs: `rounded-xl border border-gray-300`
- Navbar shadow: `shadow-md`

**Responsive Design**:
- Mobile-first approach
- Desktop breakpoint: `lg:` prefix (1024px+)
- Tablet breakpoint: `md:` prefix (768px+)

### 6. Component Structure Diagram

```mermaid
graph TD
    A[App.tsx] --> B[/admin Route]
    B --> C[ProtectedRoute requireAdmin=true]
    C --> D[Dashboard.tsx]
    D --> E[AdminLayout.tsx]
    E --> F[AdminNavbar.tsx]
    E --> G[Sidebar Navigation]
    E --> H[Main Content Area]
    H --> I[Outlet for nested routes]
    I --> J[Dashboard Overview]
    I --> K[Projects Management]
    I --> L[Categories Management]
    I --> M[Testimonials Management]
    I --> N[Contact Submissions]
    
    F --> O[User Info]
    F --> P[Logout Button]
    
    G --> Q[Navigation Links]
    Q --> R[Dashboard]
    Q --> S[Projects]
    Q --> T[Categories]
    Q --> U[Testimonials]
    Q --> V[Contacts]
```

### 7. Navigation Flow

The admin dashboard navigation structure:

- **Entry Point**: `/admin` - Protected route requiring admin role
- **Dashboard Overview**: `/admin` - Landing page with statistics (placeholder for now)
- **Projects**: `/admin/projects` - Manage projects (placeholder for now)
- **Categories**: `/admin/categories` - Manage categories (placeholder for now)
- **Testimonials**: `/admin/testimonials` - Manage testimonials (placeholder for now)
- **Contacts**: `/admin/contacts` - View contact submissions (placeholder for now)

All routes are nested under the `/admin` path and rendered within the `Dashboard` component's `Outlet`.

### 8. RTL Support

Ensure all admin components support RTL layout:

- Add `dir="rtl"` to main containers
- Use logical properties where possible (e.g., `ms-` instead of `ml-`, `me-` instead of `mr-`)
- Test navigation alignment and text direction
- Ensure icons and buttons align correctly in RTL mode
- Use `text-right` for text alignment in Hebrew content

### 9. Accessibility Considerations

- Add proper ARIA labels to navigation links
- Ensure keyboard navigation works for sidebar menu
- Add focus states to interactive elements: `focus:ring-2 focus:ring-primary`
- Use semantic HTML elements (`<nav>`, `<main>`, `<header>`)
- Ensure sufficient color contrast for text
- Add `aria-current="page"` to active navigation links

### 10. Mobile Responsiveness

**Sidebar behavior**:
- Desktop (`lg:` and up): Always visible, fixed width (w-64)
- Mobile: Hidden by default, slides in from right (RTL) when hamburger clicked
- Use state to track mobile menu open/closed
- Add overlay backdrop when mobile menu is open: `bg-black/50 fixed inset-0`
- Close mobile menu when route changes (use `useLocation` hook)

**Navbar behavior**:
- Mobile: Show hamburger menu button
- Desktop: Hide hamburger, show full user info
- Adjust padding and spacing for smaller screens