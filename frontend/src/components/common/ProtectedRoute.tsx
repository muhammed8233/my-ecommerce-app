import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { ProtectedRouteProps } from '../../types';

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // 1. If not logged in, go to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If role doesn't match backend requirements, go to Unauthorized
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;