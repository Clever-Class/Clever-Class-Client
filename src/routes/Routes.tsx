import { Route, Routes as ReactRouterRoutes, Navigate } from 'react-router-dom';

import { AppRoutes } from '~constants';
import PrivateRoutes from './PrivateRoutes';
import { Login } from '~pages/Login';
import { Dashboard } from '~pages/Dashboard';
import { Homepage } from '~pages/Homepage';

export const Routes = () => {
    return (
        <ReactRouterRoutes>
            <Route element={<PrivateRoutes />}>
                <Route element={<Dashboard />} path={AppRoutes.Dashboard} />
            </Route>
            <Route path={AppRoutes.Homepage} element={<Homepage />} />
            <Route path={AppRoutes.Login} element={<Login />} />
        </ReactRouterRoutes>
    );
};
