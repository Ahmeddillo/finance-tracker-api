import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
