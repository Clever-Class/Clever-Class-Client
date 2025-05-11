import { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/store/types';
import { pricingPlansData } from '~/data/plansData';

interface UsePaymentPopupOptions {
  defaultPlanId?: string;
}

interface UsePaymentPopupReturn {
  isOpen: boolean;
  planId: string;
  openPaymentPopup: (planId?: string) => void;
  closePaymentPopup: () => void;
  paymentPopupProps: {
    userId: string;
    priceId: string;
    countryCode: string;
    email: string;
    onClose: () => void;
  } | null;
}

/**
 * Custom hook to manage payment popup state and provide easy access throughout the application
 *
 * @param options Configuration options for the payment popup
 * @returns Methods and props for controlling and displaying the payment popup
 */
export const usePaymentPopup = (
  options?: UsePaymentPopupOptions,
): UsePaymentPopupReturn => {
  const { user } = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [planId, setPlanId] = useState('');

  // Keep track of last closed time to prevent multiple successive opens
  const lastClosedTimeRef = useRef<number>(0);

  // Find the default plan ID if none specified
  const getDefaultPlanId = useCallback(() => {
    if (options?.defaultPlanId) {
      return options.defaultPlanId;
    }

    if (user?.selectedPackageId) {
      return user.selectedPackageId;
    }

    // Use the popular plan as default
    const popularPlan = pricingPlansData.find((plan) => plan.popular === true);
    return popularPlan?.planId || pricingPlansData[0]?.planId || '';
  }, [options?.defaultPlanId, user?.selectedPackageId]);

  /**
   * Open the payment popup with the specified plan ID or default
   */
  const openPaymentPopup = useCallback(
    (customPlanId?: string) => {
      // Check if popup was recently closed to prevent immediate reopening
      const now = Date.now();
      const timeSinceLastClose = now - lastClosedTimeRef.current;

      // If less than 300ms since last close, don't reopen to prevent UI glitches
      if (timeSinceLastClose < 300) {
        return;
      }

      const selectedPlanId = customPlanId || getDefaultPlanId();
      setPlanId(selectedPlanId);
      setIsOpen(true);
    },
    [getDefaultPlanId],
  );

  /**
   * Close the payment popup
   */
  const closePaymentPopup = useCallback(() => {
    setIsOpen(false);
    // Record the close time to prevent immediate reopening
    lastClosedTimeRef.current = Date.now();

    // Reset plan ID after a short delay to ensure proper cleanup
    setTimeout(() => {
      if (!isOpen) {
        setPlanId('');
      }
    }, 300);
  }, [isOpen]);

  // Prepare the props needed for the Payment component if the popup is open
  const paymentPopupProps =
    user && isOpen && planId
      ? {
          userId: user.id,
          priceId: planId,
          countryCode: user.country || 'US',
          email: user.email,
          onClose: closePaymentPopup,
        }
      : null;

  return {
    isOpen,
    planId,
    openPaymentPopup,
    closePaymentPopup,
    paymentPopupProps,
  };
};

export default usePaymentPopup;
