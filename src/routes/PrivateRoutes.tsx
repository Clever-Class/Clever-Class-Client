import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppRoutes } from '~constants';
import { logger } from '~utils';

const PrivateRoutes = () => {
    const isLogin = true;
    const [loading, setLoading] = useState(true);

    /* const { updateAuthState, isAuthenticated, planStatus } = useAuth(); */

    const checkAuth = async () => {
        logger.debug('priv auth >>>:');
        logger.debug('isLogin >>>:', isLogin);
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    /* if (loading) {
        return <FancyLoader />;
    } */

    /* if (!loading && isAuthenticated && !planStatus) {
        logger.debug('isAuthenticated plan >>>:', isAuthenticated);
        return <Navigate to={AppRoutes.Signin_Redirect} />;
    }

    if (!loading && !isAuthenticated) {
        logger.debug('isAuthenticated >>>:', isAuthenticated);
        return <Navigate to={AppRoutes.Login} />;
    } */

    if (!loading && !isLogin) {
        return <Navigate to={AppRoutes.Login} />;
    }

    return <Outlet />;
};

export default PrivateRoutes;
