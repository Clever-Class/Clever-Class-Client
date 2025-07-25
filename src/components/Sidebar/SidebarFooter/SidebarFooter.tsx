import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { Coins, Crown, Calendar, Settings, Shield, Star } from 'lucide-react';
import { RootState } from '~/store/types';
import { usePaymentPopup } from '~/hooks';
import { Payment } from '~/components/Payment';
import { creditsService } from '~/services';
import styles from '../Sidebar.module.scss';
import moment from 'moment';

// Define types for the user data
interface UserSubscription {
  isPremiumActive?: boolean;
  status?: string;
  billingPeriod?: {
    ends_at?: string;
  };
}

interface UserData {
  subscription?: UserSubscription;
  trialCredits?: number;
}

export const SidebarFooter: React.FC = () => {
  const navigate = useNavigate();
  const { user, subscription } = useSelector((state: RootState) => state.user);
  const coinRef = useRef<HTMLDivElement>(null);

  // Create a local instance of the payment popup hook
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [credits, setCredits] = useState(0);
  const { openPaymentPopup, closePaymentPopup, isOpen, paymentPopupProps } =
    usePaymentPopup();

  // Cast user to our defined type
  const userData = user as UserData;

  // Update credits whenever the component renders or the user changes
  useEffect(() => {
    // Get initial credits from redux store
    setCredits(userData?.trialCredits || creditsService.getUserCredits());

    // Setup interval to update credits regularly
    const intervalId = setInterval(() => {
      setCredits(creditsService.getUserCredits());
    }, 2000); // Check every 2 seconds

    return () => clearInterval(intervalId);
  }, [userData]);

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

  // Add coin shine effect on hover
  useEffect(() => {
    if (isHovering && coinRef.current) {
      coinRef.current.style.animation = 'coinPulse 1s infinite';
      coinRef.current.style.transform = 'scale(1.1)';
    } else if (coinRef.current) {
      coinRef.current.style.animation = 'coinPulse 2s infinite';
      coinRef.current.style.transform = 'scale(1)';
    }
  }, [isHovering]);

  console.log(subscription, 'userData?.subscription');
  // Check if user has active premium subscription
  const hasPremiumSubscription = ![
    'not_started',
    'pending',
    'canceled',
    'paused',
  ].includes(subscription?.status || 'not_started');

  // Navigate to account settings
  const handleManageSubscription = () => {
    navigate('/account');
  };

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

  // If no sidebar footer content should be displayed
  if (hasPremiumSubscription) {
    // Format end date for display
    const endDate = subscription?.billingPeriod?.ends_at
      ? moment(subscription.billingPeriod.ends_at).format('MMM DD, YYYY')
      : 'Active';

    return (
      <div className={styles.sidebarFooter}>
        <div className={styles.premiumContainer}>
          <div className={styles.premiumStatus}>
            <div className={styles.premiumIcon}>
              <Shield size={18} strokeWidth={2} />
            </div>
            <div className={styles.premiumText}>
              <span>Premium Active</span>
            </div>
          </div>

          <div className={styles.subscriptionDetails}>
            <button
              className={styles.manageButton}
              onClick={handleManageSubscription}
            >
              <Settings size={14} />
              <span>Manage</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user shouldn't see anything in the footer
  if (
    !user ||
    (subscription &&
      !['not_started', 'pending', 'canceled', 'paused'].includes(
        subscription?.status || 'not_started',
      ))
  ) {
    return null;
  }

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
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={styles.upgradeIcon}>
          <HiOutlineLightningBolt size={20} />
        </div>
        <div className={styles.upgradeDetails}>
          <span className={styles.upgradeTitle}>
            {isProcessing ? '' : 'Upgrade to Pro'}
          </span>
          <div className={styles.upgradeCredits}>
            <div ref={coinRef} className={styles.coinWrapper}>
              <Coins size={16} />
            </div>
            <span className={styles.upgradeCreditsText}>
              {isProcessing ? 'Loading...' : `${credits} credits left`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
