import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';

import PrivateRoutes from './PrivateRoutes';

import { AppRoutes } from '~constants';
// import { Dashboard } from '~pages/Dashboard';
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
import { QuizBuilder } from '~pages/QuizBuilder';
import { QuickNotes } from '~pages/QuickNotes';
import LectureSummarizer from '~pages/LectureSummarizer';
import DashboardMKII from '~pages/Dashboard/DashboardMKII';
import { PrivacyPolicy } from '~pages/PrivacyPolicy';
import { AboutUs } from '~pages/AboutUs';
import { TermsOfService } from '~pages/TermsOfService';
import { RefundPolicy } from '~pages/RefundPolicy';

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <ReactRouterRoutes>
        <Route index element={<DashboardMKII />} />
        <Route path={AppRoutes.Settings} element={<Settings />} />
        <Route path={AppRoutes.Chatbot} element={<Chatbot />} />
        <Route path={AppRoutes.QuizBuilder} element={<QuizBuilder />} />
        <Route path={AppRoutes.QuickNotes} element={<QuickNotes />} />
        <Route
          path={AppRoutes.LectureSummarizer}
          element={<LectureSummarizer />}
        />
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
      <Route path={AppRoutes.PrivacyPolicy} element={<PrivacyPolicy />} />
      <Route path={AppRoutes.AboutUs} element={<AboutUs />} />
      <Route path={AppRoutes.TermsOfService} element={<TermsOfService />} />
      <Route path={AppRoutes.RefundPolicy} element={<RefundPolicy />} />
      <Route path={AppRoutes.Dashboard + '/*'} element={<PrivateRoutes />}>
        <Route path="*" element={<DashboardRoutes />} />
      </Route>
    </ReactRouterRoutes>
  );
};

export default Routes;
