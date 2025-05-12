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
  const [isProcessing, setIsProcessing] = useState(false);
  const { openPaymentPopup, closePaymentPopup, isOpen, paymentPopupProps } =
    usePaymentPopup();

  // Cast user to our defined type
  const userData = user as UserData;

  // When the popup is closed, update our local state
  useEffect(() => {
    if (!isOpen && showPaymentPopup) {
      setShowPaymentPopup(false);
      setIsProcessing(false);
    }
  }, [isOpen, showPaymentPopup]);

  // Add a specific handler for when the popup is manually closed
  const handleClosePopup = () => {
    console.log('Payment popup closed manually');
    setShowPaymentPopup(false);
    setIsProcessing(false);
    closePaymentPopup();
  };

  // Reset processing state after a timeout in case something goes wrong
  useEffect(() => {
    let resetTimer: NodeJS.Timeout | null = null;

    if (isProcessing) {
      // Safety timeout to reset processing state after 20 seconds
      resetTimer = setTimeout(() => {
        setIsProcessing(false);
      }, 20000);
    }

    return () => {
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [isProcessing]);

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
  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent multiple clicks
    if (isProcessing) return;

    setIsProcessing(true);

    // Clear the warning banner hide time to allow showing the popup
    localStorage.removeItem('warningBannerHideTime');
    // Force payment popup to show by clearing the last shown time
    localStorage.removeItem('paymentPopupLastShown');

    setShowPaymentPopup(true);
    openPaymentPopup();
  };

  return (
    <div className={styles.sidebarFooter}>
      {paymentPopupProps && showPaymentPopup && (
        <Payment
          {...paymentPopupProps}
          onClose={() => {
            console.log('Payment closed from SidebarFooter');
            setIsProcessing(false);
            setShowPaymentPopup(false);
            closePaymentPopup();
          }}
        />
      )}

      <div
        className={`${styles.upgradeBox} ${
          isProcessing ? styles.processing : ''
        }`}
        onClick={handleUpgradeClick}
      >
        <div className={styles.upgradeIcon}>
          <HiOutlineLightningBolt size={20} />
        </div>
        <div className={styles.upgradeDetails}>
          <span className={styles.upgradeTitle}>
            {isProcessing ? '' : 'Upgrade to Pro'}
          </span>
          <span className={styles.upgradeCredits}>
            {isProcessing
              ? 'Loading...'
              : `${userData?.trialCredits || 0} credits left`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
