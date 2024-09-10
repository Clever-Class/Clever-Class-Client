import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';

import PrivateRoutes from './PrivateRoutes';

import { AppRoutes } from '~constants';
import { Dashboard } from '~pages/Dashboard';
import { Homepage } from '~pages/Homepage';
import { Signup } from '~pages/Signup';
import { ForgotPassword } from '~pages/ForgotPassword';
import { ResetPassword } from '~pages/ResetPassword/ResetPassword';
import { LoginPage } from '~pages/Login';

export const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route element={<PrivateRoutes />}>
        <Route element={<Dashboard />} path={AppRoutes.Dashboard} />
      </Route>
      <Route path={AppRoutes.Homepage} element={<Homepage />} />
      <Route path={AppRoutes.Signup} element={<Signup />} />
      <Route path={AppRoutes.Login} element={<LoginPage />} />
      <Route path={AppRoutes.ForgotPassword} element={<ForgotPassword />} />
      <Route path={AppRoutes.ResetPassword} element={<ResetPassword />} />
    </ReactRouterRoutes>
  );
};
