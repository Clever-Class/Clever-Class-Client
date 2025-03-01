import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import moment from 'moment';

// Components
import { Sidebar } from '~components/Sidebar/Sidebar';
import { Payment } from '~components/Payment';
import { WarningBanner } from '~components/common/WarningBanner';

// Store and Types
import { RootStateType } from '~store/types';
import { AppDispatch } from '~store';
import { fetchUserData } from '~store/actions/authActions';
import { api } from '~api';

// Constants
import { DEFAULT_SELECTED_PACKAGE } from '~constants';

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

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { user, subscription } = useSelector(
    (state: RootStateType) => state.user,
  );
  const [showPopup, setShowPopup] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);

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

    // Fetch immediately
    fetchData();

    // Then fetch every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  useEffect(() => {
    const lastShownDate = localStorage.getItem('paymentPopupLastShown');
    const hasPendingSubscription =
      subscription?.status === 'pending' ||
      subscription?.status === 'not_started';

    const is24HoursPassed = () => {
      if (!lastShownDate) return true;
      const lastShown = new Date(lastShownDate);
      const now = new Date();
      const hoursDifference =
        Math.abs(now.getTime() - lastShown.getTime()) / (1000 * 60 * 60);
      return hoursDifference > 24;
    };

    if (user && hasPendingSubscription && is24HoursPassed()) {
      setShowPopup(true);
      localStorage.setItem('paymentPopupLastShown', new Date().toISOString());
    }
  }, [user, subscription?.status]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleUpdateCard = () => {
    setIsUpdatingCard(true);
    // Add a small delay before redirect to show loading state
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
        dispatch(fetchUserData()); // Refresh user data
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

  const packageId = user?.selectedPackageId || DEFAULT_SELECTED_PACKAGE;
  const showBanner =
    subscription?.status === 'past_due' || subscription?.status === 'canceled';

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      {showPopup && user && (
        <Payment
          userId={user.id}
          priceId={packageId}
          countryCode={user?.country}
          email={user?.email}
          onClose={handleClosePopup}
        />
      )}
      <div className={styles.mainContent}>
        <main className={styles.content}>
          {subscription?.status === 'past_due' && (
            <WarningBanner
              message={pastDueMessage}
              buttonText={
                isUpdatingCard ? 'Redirecting...' : 'Update Card Details'
              }
              onButtonClick={handleUpdateCard}
              disabled={isUpdatingCard}
            />
          )}
          {subscription?.status === 'canceled' && (
            <WarningBanner
              message={cancelledMessage(subscription?.billingPeriod?.ends_at)}
              buttonText={isResuming ? 'Resuming...' : "Don't Cancel"}
              noButton={false}
              onButtonClick={handleResumeSubscription}
              disabled={isResuming}
            />
          )}
          <div
            className={`${styles.container} ${
              showBanner ? styles.withBanner : ''
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
