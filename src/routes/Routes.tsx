import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';

import PrivateRoutes from './PrivateRoutes';

import { AppRoutes } from '~constants';
import { Dashboard } from '~pages/Dashboard';
import { Homepage } from '~pages/Homepage';
import { Signup } from '~pages/Signup';
import { ForgotPassword } from '~pages/ForgotPassword';
import { ResetPassword } from '~pages/ResetPassword/ResetPassword';
import { LoginPage } from '~pages/Login';
import { SuccessPayment } from '~pages/SuccessPayment/SuccessPayment';
import { Settings } from '~pages/Settings/Settings';
import { DashboardLayout } from '~components/Layouts';
import { Chatbot } from '~pages/Chatbot/Chatbot';
import { PricingPage } from '~pages/PricingPage';

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <ReactRouterRoutes>
        <Route index element={<Dashboard />} />
        <Route path={AppRoutes.Settings} element={<Settings />} />
        <Route path={AppRoutes.Chatbot} element={<Chatbot />} />
      </ReactRouterRoutes>
    </DashboardLayout>
  );
};

const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route path={AppRoutes.Homepage} element={<Homepage />} />
      <Route path={AppRoutes.Login} element={<LoginPage />} />
      <Route path={AppRoutes.Signup} element={<Signup />} />
      <Route path={AppRoutes.ForgotPassword} element={<ForgotPassword />} />
      <Route path={AppRoutes.ResetPassword} element={<ResetPassword />} />
      <Route path={AppRoutes.PaymentSuccess} element={<SuccessPayment />} />
      <Route path={AppRoutes.Pricing} element={<PricingPage />} />
      <Route path={AppRoutes.Dashboard + '/*'} element={<PrivateRoutes />}>
        <Route path="*" element={<DashboardRoutes />} />
      </Route>
    </ReactRouterRoutes>
  );
};

export default Routes;
