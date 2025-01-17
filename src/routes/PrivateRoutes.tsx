import { Navigate, Outlet } from 'react-router-dom';
import { AppRoutes } from '~constants';
import { useAuth } from '~hooks';

const PrivateRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={AppRoutes.Login} />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
