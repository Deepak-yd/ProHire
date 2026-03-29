import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// role param optional: string or array of allowed roles
export default function ProtectedRoute({ children, role }) {
  const { token, user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-[40vh] flex items-center justify-center text-gray-600">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!user || !roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }
  return children;
}
