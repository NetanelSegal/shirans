import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../Loader/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" dir="rtl">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
