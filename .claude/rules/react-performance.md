# React Performance Guidelines (Vite + React)

Rules applicable to this project (React + Vite, NOT Next.js).

## CRITICAL: Eliminate Waterfalls

### Use Promise.all() for independent async operations
```typescript
// Bad: sequential
const user = await fetchUser();
const posts = await fetchPosts();

// Good: parallel
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
```

### Defer await until needed
Move `await` into the branch where the result is actually used. Don't block early code paths unnecessarily.

### Start promises early, await late
```typescript
const sessionPromise = auth();
const configPromise = fetchConfig();
const session = await sessionPromise;
const [config, data] = await Promise.all([configPromise, fetchData(session.user.id)]);
```

## CRITICAL: Bundle Size

### Avoid barrel file imports
```typescript
// Bad: loads entire library
import { Check, X } from 'lucide-react';

// Good: loads only what you need
import Check from 'lucide-react/dist/esm/icons/check';
```

### Dynamic imports for heavy components
```typescript
const HeavyEditor = React.lazy(() => import('./heavy-editor'));
```

### Preload on user intent (hover/focus)
```tsx
<button onMouseEnter={() => import('./heavy-module')} onClick={onClick}>Open</button>
```

## MEDIUM: Re-render Optimization

### Functional setState for stable callbacks
```typescript
// Bad: stale closure risk
const addItem = useCallback((item) => setItems([...items, item]), [items]);

// Good: always uses latest state
const addItem = useCallback((item) => setItems(curr => [...curr, item]), []);
```

### Lazy state initialization
```typescript
// Bad: runs every render
const [index] = useState(buildSearchIndex(items));

// Good: runs only once
const [index] = useState(() => buildSearchIndex(items));
```

### Narrow effect dependencies
```typescript
// Bad: re-runs on any user field change
useEffect(() => { console.log(user.id); }, [user]);

// Good: re-runs only when id changes
useEffect(() => { console.log(user.id); }, [user.id]);
```

### Use transitions for non-urgent updates
```typescript
import { startTransition } from 'react';
startTransition(() => setScrollY(window.scrollY));
```

## MEDIUM: Rendering

### CSS content-visibility for long lists
```css
.list-item { content-visibility: auto; contain-intrinsic-size: 0 80px; }
```

### Use ternary, not && for conditional rendering with numbers
```tsx
// Bad: renders "0" when count is 0
{count && <Badge>{count}</Badge>}

// Good: renders nothing when count is 0
{count > 0 ? <Badge>{count}</Badge> : null}
```

### Use toSorted() instead of sort() for immutability
```typescript
// Bad: mutates array
const sorted = users.sort((a, b) => a.name.localeCompare(b.name));

// Good: creates new array
const sorted = users.toSorted((a, b) => a.name.localeCompare(b.name));
```

## LOW: JavaScript Performance

- Build index Maps for repeated lookups (`new Map(arr.map(x => [x.id, x]))`)
- Use Set for O(1) membership checks instead of Array.includes
- Combine multiple filter/map into single loop
- Early return from functions when result is determined
- Cache repeated function calls in module-level Map
