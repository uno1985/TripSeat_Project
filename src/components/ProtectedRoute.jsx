import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLogin, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isLogin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
