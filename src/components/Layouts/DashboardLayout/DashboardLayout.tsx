import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Components
import { Sidebar } from '~components/Sidebar/Sidebar';
import { Payment } from '~components/Payment';

// Store and Types
import { RootStateType } from '~store/types';
import { AppDispatch } from '~store';
import { fetchUserData } from '~store/actions/authActions';

// Constants
import { DEFAULT_SELECTED_PACKAGE } from '~constants';

// Styles
import styles from './DashboardLayout.module.scss';

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { user, subscription } = useSelector(
    (state: RootStateType) => state.user,
  );
  const [showPopup, setShowPopup] = useState(false);

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
    window.location.href = subscription?.updatePaymentMethodUrl || '';
  };

  const packageId = user?.selectedPackageId || DEFAULT_SELECTED_PACKAGE;

  console.log(showPopup, subscription?.status, 'show popup');
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
            <div className={styles.warningBanner}>
              <div className={styles.bannerContent}>
                <svg
                  className={styles.warningIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0V9a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Your payment has failed. Please update your card details to
                  continue using our services.
                </span>
              </div>
              <button
                onClick={handleUpdateCard}
                className={styles.updateButton}
              >
                Update Card Details
              </button>
            </div>
          )}
          <div className={styles.container}>{children}</div>
        </main>
      </div>
    </div>
  );
};
