import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { Menu } from 'lucide-react';

// Components
import { Sidebar } from '~components/Sidebar/Sidebar';
import { Payment } from '~components/Payment';
import { WarningBanner } from '~components/common/WarningBanner';

// Store and Types
import { AppDispatch } from '~store';
import { RootStateType } from '~store/types/rootStateTypes';
import { fetchUserData } from '~store/actions/authActions';
import { api } from '~api';

// Constants
import { DEFAULT_SELECTED_PACKAGE } from '~constants';
import { pricingPlansData } from '~/data/plansData';

// Hooks
import { usePaymentPopup } from '~/hooks';

// Styles
import styles from './DashboardLayout.module.scss';

type DashboardLayoutProps = {
  children: ReactNode;
};

const pastDueMessage =
  'Your payment has failed. Please update your card details to continue using our services.';
const cancelledMessage = (endDate: string | undefined) =>
  `Your subscription is scheduled to be canceled on ${
    endDate
      ? moment(endDate).format('MMMM D YYYY')
      : 'the end of your billing period'
  }.`;

const BANNER_HIDE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, subscription } = useSelector(
    (state: RootStateType) => state.user,
  );

  // Track previous user ID to detect login/logout
  const prevUserIdRef = useRef<string | null>(null);

  const {
    openPaymentPopup,
    closePaymentPopup,
    isOpen: showPopup,
    paymentPopupProps,
  } = usePaymentPopup();

  const [isResuming, setIsResuming] = useState(false);
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [bannerInitialized, setBannerInitialized] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth <= 1024);
      setIsSidebarVisible(!(window.innerWidth <= 1024));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if banner should be shown based on hide time
  useEffect(() => {
    // Only initialize banner if user and subscription data is loaded
    if (user && subscription) {
      const bannerHideTime = localStorage.getItem('warningBannerHideTime');
      if (bannerHideTime) {
        const hideTime = parseInt(bannerHideTime, 10);
        const now = Date.now();
        const hoursDifference = (now - hideTime) / (1000 * 60 * 60);
        // Only hide the banner if less than 24 hours have passed
        if (hoursDifference < 24) {
          setShowWarningBanner(false);
        } else {
          setShowWarningBanner(true);
        }
      } else {
        setShowWarningBanner(true);
      }
      setBannerInitialized(true);
    }
  }, [user, subscription]);

  // Fetch user data when component mounts and every 5 minutes
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchUserData());
      } catch (error: any) {
        if (error?.response?.status === 401) {
          navigate('/login');
        } else {
          toast.error('Failed to fetch user data');
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  // Check for payment_popup parameter and show popup if it exists
  useEffect(() => {
    const paymentPopupParam = searchParams.get('payment_popup');
    const requiresPayment =
      subscription?.status === 'pending' ||
      subscription?.status === 'not_started';

    if (paymentPopupParam === 'true' && user && requiresPayment) {
      // Check if a specific plan was provided in the URL
      const planParam = searchParams.get('plan');

      // Find the plan ID to use
      let planId: string;

      if (planParam) {
        // If a plan parameter was provided, use it
        planId = planParam;
      } else {
        // Otherwise use default logic
        const selectedPackageId = user.selectedPackageId;
        const popularPlan = pricingPlansData.find(
          (plan) => plan.popular === true,
        );
        planId =
          selectedPackageId || popularPlan?.planId || DEFAULT_SELECTED_PACKAGE;
      }

      // Open the payment popup with the determined plan ID
      openPaymentPopup(planId);

      // Remove the parameters from the URL without refreshing the page
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('payment_popup');
      newSearchParams.delete('plan');
      navigate({ search: newSearchParams.toString() }, { replace: true });
    }
  }, [searchParams, user, navigate, openPaymentPopup, subscription?.status]);

  useEffect(() => {
    const lastShownDate = localStorage.getItem('paymentPopupLastShown');
    const lastSessionId = localStorage.getItem('paymentPopupSessionId');
    const warningBannerHideTime = localStorage.getItem('warningBannerHideTime');
    const currentSessionId = user?.id || '';
    const requiresPayment =
      subscription?.status === 'pending' ||
      subscription?.status === 'not_started';

    const is24HoursPassed = (timestamp: string | null) => {
      if (!timestamp) return true;
      const lastTime = parseInt(timestamp, 10);
      const now = Date.now();
      const hoursDifference = (now - lastTime) / (1000 * 60 * 60);
      return hoursDifference > 24;
    };

    const isNewSession = lastSessionId !== currentSessionId;

    // Reset timer if user has changed (logged out and logged back in)
    if (user && isNewSession) {
      localStorage.removeItem('paymentPopupLastShown');
      localStorage.setItem('paymentPopupSessionId', currentSessionId);
    }

    // Show the payment popup if:
    // 1. The subscription requires payment (pending or not_started status)
    // 2. It hasn't been shown in the last 24 hours OR it's a new login session
    // 3. The banner hide time is more than 24 hours ago
    // 4. User has all required data
    if (
      requiresPayment &&
      (is24HoursPassed(lastShownDate) || isNewSession) &&
      is24HoursPassed(warningBannerHideTime) &&
      user?.id &&
      user?.email
    ) {
      // Find the default plan to show
      const selectedPackageId = user?.selectedPackageId;
      const popularPlan = pricingPlansData.find(
        (plan) => plan.popular === true,
      );
      const defaultPlanId =
        selectedPackageId || popularPlan?.planId || DEFAULT_SELECTED_PACKAGE;

      openPaymentPopup(defaultPlanId);
      localStorage.setItem('paymentPopupLastShown', Date.now().toString());
    }
  }, [user, subscription?.status, openPaymentPopup]);

  // Detect user changes (login/logout) and handle localStorage cleanup
  useEffect(() => {
    const currentUserId = user?.id || null;
    const prevUserId = prevUserIdRef.current;

    // If user ID changed, handle the change
    if (currentUserId !== prevUserId) {
      // If user logged in (was null, now has value)
      if (currentUserId && !prevUserId) {
        console.log('User logged in, clearing payment popup session data');
        localStorage.removeItem('paymentPopupLastShown');
        localStorage.removeItem('paymentPopupSessionId');
      }

      // Update the ref with current user ID
      prevUserIdRef.current = currentUserId;
    }
  }, [user?.id]);

  const handleUpdateCard = () => {
    setIsUpdatingCard(true);
    setTimeout(() => {
      window.location.href = subscription?.updatePaymentMethodUrl || '';
    }, 500);
  };

  const handleResumeSubscription = async () => {
    setIsResuming(true);
    try {
      const response = await api.ccServer.post('/subscription/resume-canceled');
      if (response.data.success) {
        toast.success('Subscription resumed successfully');
        dispatch(fetchUserData());
      } else {
        toast.error(response.data.message || 'Failed to resume subscription');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to resume subscription',
      );
    } finally {
      setIsResuming(false);
    }
  };

  const handleBannerClose = () => {
    setShowWarningBanner(false);
    localStorage.setItem('warningBannerHideTime', Date.now().toString());
  };

  // Create a custom payment popup props with our own close handler
  const customPaymentProps = paymentPopupProps
    ? {
        ...paymentPopupProps,
        onClose: () => {
          // Use the hook's closePaymentPopup to ensure proper state cleanup
          closePaymentPopup();
        },
      }
    : null;

  const showBanner =
    bannerInitialized &&
    (subscription?.status === 'past_due' ||
      subscription?.status === 'canceled' ||
      subscription?.status === 'pending' ||
      subscription?.status === 'not_started') &&
    showWarningBanner;

  const getBannerMessage = () => {
    if (subscription?.status === 'past_due') {
      return pastDueMessage;
    } else if (subscription?.status === 'canceled') {
      return cancelledMessage(subscription?.billingPeriod?.ends_at);
    } else if (
      subscription?.status === 'pending' ||
      subscription?.status === 'not_started'
    ) {
      return 'Complete your payment to activate all premium features.';
    }
    return '';
  };

  const getBannerButtonText = () => {
    if (subscription?.status === 'past_due') {
      return isUpdatingCard ? 'Redirecting...' : 'Update Card Details';
    } else if (subscription?.status === 'canceled') {
      return isResuming ? 'Resuming...' : "Don't Cancel";
    } else if (
      subscription?.status === 'pending' ||
      subscription?.status === 'not_started'
    ) {
      return 'Complete Payment';
    }
    return '';
  };

  const handleBannerAction = () => {
    if (subscription?.status === 'past_due') {
      handleUpdateCard();
    } else if (subscription?.status === 'canceled') {
      handleResumeSubscription();
    } else if (
      subscription?.status === 'pending' ||
      subscription?.status === 'not_started'
    ) {
      // Clear localStorage items to force payment popup to show
      localStorage.removeItem('paymentPopupLastShown');
      // Find the default plan to show
      const selectedPackageId = user?.selectedPackageId;
      const popularPlan = pricingPlansData.find(
        (plan) => plan.popular === true,
      );
      const defaultPlanId =
        selectedPackageId || popularPlan?.planId || DEFAULT_SELECTED_PACKAGE;

      openPaymentPopup(defaultPlanId);
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isVisible={isSidebarVisible}
        onToggle={toggleSidebar}
        isMobile={window.innerWidth <= 1024}
      />

      <div
        className={`${styles.mainContent} ${
          isSidebarCollapsed ? styles.sidebarCollapsed : ''
        }`}
      >
        <button
          className={`${styles.menuButton} ${
            isSidebarVisible ? styles.active : ''
          }`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu />
        </button>

        <main className={styles.content}>
          {showPopup && customPaymentProps && (
            <Payment {...customPaymentProps} />
          )}

          <div
            className={`${styles.container} ${
              showBanner ? styles.withBanner : ''
            }`}
          >
            {showBanner && (
              <WarningBanner
                message={getBannerMessage()}
                buttonText={getBannerButtonText()}
                onButtonClick={handleBannerAction}
                onClose={handleBannerClose}
                disabled={isUpdatingCard || isResuming}
              />
            )}

            {children}
          </div>
        </main>
      </div>

      <div
        className={`${styles.overlay} ${
          isSidebarVisible ? styles.visible : ''
        }`}
        onClick={() => setIsSidebarVisible(false)}
      />
    </div>
  );
};
