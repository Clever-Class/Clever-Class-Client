import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';

import PrivateRoutes from './PrivateRoutes';

import { AppRoutes } from '~constants';
import { Login } from '~pages/Login';
import { Dashboard } from '~pages/Dashboard';
import { Homepage } from '~pages/Homepage';
import { Signup } from '~pages/Signup';
import { ForgotPassword } from '~pages/ForgotPassword';
import { ResetPassword } from '~pages/ResetPassword/ResetPassword';
import { Payment } from '~pages/Payment';

export const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route element={<PrivateRoutes />}>
        <Route element={<Dashboard />} path={AppRoutes.Dashboard} />
      </Route>
      <Route path={AppRoutes.Homepage} element={<Homepage />} />
      <Route path={AppRoutes.Signup} element={<Signup />} />
      <Route path={AppRoutes.Login} element={<Login />} />
      <Route path={AppRoutes.ForgotPassword} element={<ForgotPassword />} />
      <Route path={AppRoutes.ResetPassword} element={<ResetPassword />} />
      <Route path={AppRoutes.Payment} element={<Payment />} />
    </ReactRouterRoutes>
  );
};
