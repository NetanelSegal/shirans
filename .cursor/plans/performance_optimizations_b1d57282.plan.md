---
name: Performance Optimizations
overview: Apply React performance best practices from the codebase rules. Review and optimize components for better performance, following the React best practices guidelines.
todos:
  - id: bundle-audit
    content: Audit bundle size and identify large dependencies
    status: pending
  - id: barrel-imports
    content: Convert barrel file imports to direct imports
    status: pending
  - id: dynamic-imports
    content: Add dynamic imports for heavy components
    status: pending
  - id: data-fetching-optimization
    content: Optimize data fetching patterns (Promise.all, defer await)
    status: pending
  - id: suspense-boundaries
    content: Add strategic Suspense boundaries
    status: pending
  - id: component-memoization
    content: Add React.memo to expensive components
    status: pending
  - id: hook-optimization
    content: Optimize useMemo/useCallback usage
    status: pending
  - id: context-optimization
    content: Optimize context values and prevent unnecessary re-renders
    status: pending
  - id: rendering-optimization
    content: Hoist static JSX and fix conditional rendering
    status: pending
  - id: javascript-optimization
    content: Optimize array operations and lookups
    status: pending
isProject: false
---

# React Performance Optimizations

## Overview

Apply React performance best practices from the project's React best practices rules. Review components and optimize for better performance, bundle size, and user experience.

## Areas to Optimize

### 1. Bundle Size Optimization

- **Barrel File Imports**: Check for barrel file imports (lucide-react, etc.) and convert to direct imports
- **Dynamic Imports**: Identify heavy components and lazy load them
- **Code Splitting**: Ensure proper code splitting with React.lazy

### 2. Eliminating Waterfalls

- **Parallel Data Fetching**: Review data fetching patterns, use Promise.all() where appropriate
- **Defer Await**: Move await operations to where they're actually needed
- **Suspense Boundaries**: Add strategic Suspense boundaries for faster initial paint

### 3. Re-render Optimization

- **Memoization**: Add React.memo to expensive components
- **useMemo/useCallback**: Optimize expensive computations and callbacks
- **State Management**: Review state structure to minimize re-renders
- **Functional setState**: Use functional updates to prevent stale closures

### 4. Rendering Performance

- **Static JSX Hoisting**: Hoist static JSX elements outside components
- **Conditional Rendering**: Use explicit conditionals instead of && for falsy values
- **SVG Optimization**: Optimize SVG precision and animation patterns

### 5. JavaScript Performance

- **Array Operations**: Replace multiple iterations with single loops
- **Lookup Optimization**: Use Map/Set for O(1) lookups instead of array.find()
- **Early Returns**: Add early returns to avoid unnecessary computation

## Files to Review and Optimize

### High Priority

- `client/src/pages/Home/Home.tsx` - Check for waterfalls, memoization opportunities
- `client/src/pages/Projects/Projects.tsx` - Optimize project list rendering
- `client/src/pages/Project/Project.tsx` - Optimize project detail page
- `client/src/components/Navbar/Navbar.tsx` - Check for unnecessary re-renders
- `client/src/contexts/ProjectsContext.tsx` - Optimize context value memoization

### Medium Priority

- `client/src/pages/Home/components/Testimonials.tsx` - Optimize animation and rendering
- `client/src/components/Footer/Footer.tsx` - Optimize form rendering
- `client/src/components/FavoriteProjects/FavoriteProjects.tsx` - Check memoization

### Bundle Analysis

- Run bundle analyzer to identify large dependencies
- Check for duplicate dependencies
- Identify opportunities for tree-shaking

## Implementation Steps

### Phase 1: Bundle Size

1. **Audit Imports**

- Search for barrel file imports (e.g., `from 'lucide-react'`)
- Convert to direct imports (e.g., `from 'lucide-react/dist/esm/icons/check'`)
- Check package.json for large dependencies

1. **Dynamic Imports**

- Identify heavy components (Monaco editor, charts, etc.)
- Convert to dynamic imports with React.lazy
- Add Suspense boundaries

1. **Code Splitting**

- Ensure routes use React.lazy (already done)
- Check for additional splitting opportunities

### Phase 2: Data Fetching

1. **Review Data Fetching**

- Check ProjectsContext for waterfall patterns
- Use Promise.all() for parallel requests
- Defer non-critical data fetching

1. **Suspense Boundaries**

- Add Suspense boundaries around data-fetching components
- Show loading states faster

### Phase 3: Re-render Optimization

1. **Component Memoization**

- Add React.memo to list items (Project cards, etc.)
- Memoize expensive components

1. **Hook Optimization**

- Review useMemo/useCallback usage
- Add missing memoization
- Use functional setState updates

1. **Context Optimization**

- Split contexts if needed
- Memoize context values
- Prevent unnecessary re-renders

### Phase 4: Rendering Performance

1. **Static Elements**

- Hoist static JSX outside components
- Extract constants

1. **Conditional Rendering**

- Fix && operators that might render 0 or false
- Use explicit ternaries

1. **SVG Optimization**

- Check SVG precision
- Optimize animation patterns

### Phase 5: JavaScript Performance

1. **Array Operations**

- Combine multiple .map()/.filter() calls
- Use early returns
- Build index maps for repeated lookups

1. **Lookup Optimization**

- Replace array.find() with Map lookups
- Cache repeated function calls

## Key Files to Modify

### Context Optimization

- `client/src/contexts/ProjectsContext.tsx` - Memoize context value
- `client/src/contexts/ScreenProvider.tsx` - Check for optimization

### Component Optimization

- `client/src/pages/Projects/components/Project.tsx` - Add React.memo
- `client/src/components/FavoriteProjects/FavoriteProjects.tsx` - Optimize
- `client/src/pages/Home/components/Testimonials.tsx` - Optimize animation

### Data Fetching

- `client/src/contexts/ProjectsContext.tsx` - Review fetching patterns
- Any API hooks - Check for parallelization opportunities

## Performance Metrics to Track

- Initial bundle size
- Time to Interactive (TTI)
- Largest Contentful Paint (LCP)
- First Contentful Paint (FCP)
- Re-render counts (React DevTools Profiler)

## Testing

- Use React DevTools Profiler to identify slow renders
- Measure bundle size before/after
- Test performance on slow networks
- Verify no functionality regressions

## Notes

- Follow React best practices rules from `.cursor/rules/react-best-practices.mdc`
- Prioritize high-impact optimizations first
- Measure before and after to verify improvements
- Don't over-optimize - focus on actual bottlenecks
- Consider React Compiler if available (automatic optimizations)
