import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';

import { AppRoutes } from '~constants';
import PrivateRoutes from './PrivateRoutes';
import { Login } from '~pages/Login';
import { Dashboard } from '~pages/Dashboard';
import { Homepage } from '~pages/Homepage';
import { Signup } from '~pages/Signup';

export const Routes = () => {
    return (
        <ReactRouterRoutes>
            <Route element={<PrivateRoutes />}>
                <Route element={<Dashboard />} path={AppRoutes.Dashboard} />
            </Route>
            <Route path={AppRoutes.Homepage} element={<Homepage />} />
            <Route path={AppRoutes.Login} element={<Login />} />
            <Route path={AppRoutes.Signup} element={<Signup />} />
        </ReactRouterRoutes>
    );
};
