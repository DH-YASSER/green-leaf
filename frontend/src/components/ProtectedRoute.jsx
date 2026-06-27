import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;