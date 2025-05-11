import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { RootState } from '~/store/types';
import { usePaymentPopup } from '~/hooks';
import { Payment } from '~/components/Payment';
import styles from '../Sidebar.module.scss';

// Define types for the user data
interface UserSubscription {
  isPremiumActive?: boolean;
  status?: string;
}

interface UserData {
  subscription?: UserSubscription;
  trialCredits?: number;
}

export const SidebarFooter: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);

  // Create a local instance of the payment popup hook
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const { openPaymentPopup, closePaymentPopup, isOpen, paymentPopupProps } =
    usePaymentPopup();

  // Cast user to our defined type
  const userData = user as UserData;

  // When the popup is closed, update our local state
  useEffect(() => {
    if (!isOpen && showPaymentPopup) {
      setShowPaymentPopup(false);
    }
  }, [isOpen, showPaymentPopup]);

  // Check if user has non-active subscription status
  const shouldShowUpgrade =
    !userData?.subscription?.isPremiumActive &&
    ['not_started', 'pending', 'canceled', 'paused'].includes(
      userData?.subscription?.status || 'not_started',
    );

  // If user shouldn't see upgrade box, render nothing
  if (!shouldShowUpgrade) {
    return null;
  }

  // Open payment popup when upgrade button is clicked
  const handleUpgradeClick = () => {
    setShowPaymentPopup(true);
    openPaymentPopup();
  };

  // Custom close handler to make sure we update our local state
  const handleClosePopup = () => {
    setShowPaymentPopup(false);
    closePaymentPopup();
  };

  return (
    <div className={styles.sidebarFooter}>
      {paymentPopupProps && (
        <Payment {...paymentPopupProps} onClose={handleClosePopup} />
      )}

      <div className={styles.upgradeBox} onClick={handleUpgradeClick}>
        <div className={styles.upgradeIcon}>
          <HiOutlineLightningBolt size={20} />
        </div>
        <div className={styles.upgradeDetails}>
          <span className={styles.upgradeTitle}>Upgrade to Pro</span>
          <span className={styles.upgradeCredits}>
            {userData?.trialCredits || 0} credits left
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
