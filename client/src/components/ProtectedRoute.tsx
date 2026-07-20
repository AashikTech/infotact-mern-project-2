import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to correct page based on actual role
    if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/shop" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
