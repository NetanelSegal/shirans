import Loader from './Loader';

/**
 * Full-viewport loading state, for moments when no page shell is on screen yet
 * (the auth gate, a route-level chunk still downloading).
 *
 * Exists so every such moment is positioned identically — hand-copied centering
 * wrappers had drifted between the public layout and the admin routes, which made
 * the same spinner appear in a different place at each step and read as a jump.
 */
export default function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" dir="rtl">
      <Loader />
    </div>
  );
}
