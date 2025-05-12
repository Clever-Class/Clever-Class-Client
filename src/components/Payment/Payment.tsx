import { Environments, initializePaddle, Paddle } from '@paddle/paddle-js';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { PADDLE_TOKEN, PADDLE_ENVIRONMENT, AppRoutes } from '~/constants';
import { RootStateType } from '~store/types/rootStateTypes';

interface PaymentProps {
  priceId: string;
  userId: string;
  email: string;
  countryCode: string;
  onError?: (error: Error) => void;
  onClose: () => void;
}

export const Payment: React.FC<PaymentProps> = ({
  priceId,
  userId,
  email,
  countryCode,
  onError,
  onClose,
}) => {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const checkoutOpenedRef = useRef(false);

  // get user from the store
  const { user, subscription } = useSelector(
    (state: RootStateType) => state.user,
  );

  console.log(user, 'user on payment');
  console.log(subscription, 'subscription on payment');

  // Validate required props
  useEffect(() => {
    if (!priceId) {
      const errorMessage = 'Missing required prop: priceId';
      setError(new Error(errorMessage));
      onError?.(new Error(errorMessage));
    } else if (!userId) {
      const errorMessage = 'Missing required prop: userId';
      setError(new Error(errorMessage));
      onError?.(new Error(errorMessage));
    } else if (!email) {
      const errorMessage = 'Missing required prop: email';
      setError(new Error(errorMessage));
      onError?.(new Error(errorMessage));
    } else if (!countryCode) {
      const errorMessage = 'Missing required prop: countryCode';
      setError(new Error(errorMessage));
      onError?.(new Error(errorMessage));
      // Use default country code if missing
      countryCode = 'US';
    }
  }, [priceId, userId, email, countryCode, onError]);

  useEffect(() => {
    // Set up event listener for when Paddle checkout is closed
    const handleMessage = (event: MessageEvent) => {
      // Only process messages from Paddle
      if (
        event.origin.includes('paddle.com') ||
        event.origin.includes('paddle.dev')
      ) {
        try {
          const data =
            typeof event.data === 'string'
              ? JSON.parse(event.data)
              : event.data;

          // Check if this is a checkout close event
          if (data && data.type === 'paddle-checkout-close') {
            console.log('Paddle checkout closed via postMessage');
            checkoutOpenedRef.current = false;
            onClose();
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Clean up
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onClose]);

  const openCheckout = useCallback(() => {
    if (paddle && !checkoutOpenedRef.current) {
      try {
        checkoutOpenedRef.current = true;

        // Open the checkout
        paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customer: {
            email,
            address: {
              countryCode: countryCode.toUpperCase(),
            },
          },
          customData: {
            userId,
            skipIntermediatePage: true,
          },
          settings: {
            displayMode: 'overlay',
            theme: 'light',
            locale: 'en',
            successUrl: `${window.location.origin}${AppRoutes.PaymentSuccess}`,
          },
        });

        localStorage.setItem('warningBannerHideTime', Date.now().toString());

        // Set up a backup method for detecting checkout close - check every second
        // if the checkout overlay is still in the DOM
        const checkoutCloseInterval = setInterval(() => {
          const checkoutFrame = document.querySelector(
            '#paddle-checkout-frame',
          );
          if (!checkoutFrame && checkoutOpenedRef.current) {
            console.log('Paddle checkout closed (detected by DOM check)');
            checkoutOpenedRef.current = false;
            clearInterval(checkoutCloseInterval);
            onClose();
          }
        }, 1000);

        // Clear interval after 10 minutes to prevent memory leaks
        setTimeout(() => {
          clearInterval(checkoutCloseInterval);
          // If checkout is still open after 10 minutes, force close it
          if (checkoutOpenedRef.current) {
            checkoutOpenedRef.current = false;
            onClose();
          }
        }, 10 * 60 * 1000);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to open checkout'),
        );
        onError?.(
          err instanceof Error ? err : new Error('Failed to open checkout'),
        );
        checkoutOpenedRef.current = false;
      }
    }
  }, [paddle, priceId, email, countryCode, onError, userId, onClose]);

  useEffect(() => {
    const loadPaddle = async () => {
      try {
        setIsLoading(true);
        const paddleInstance = await initializePaddle({
          environment: PADDLE_ENVIRONMENT as Environments,
          token: PADDLE_TOKEN,
        });
        setPaddle(paddleInstance as Paddle);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to initialize Paddle'),
        );
        onError?.(
          err instanceof Error ? err : new Error('Failed to initialize Paddle'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPaddle();
  }, [onError]);

  useEffect(() => {
    if (paddle && !isLoading && !error) {
      openCheckout();
    }

    return () => {
      // Force close checkout when component unmounts
      if (checkoutOpenedRef.current) {
        checkoutOpenedRef.current = false;
        onClose();
      }
    };
  }, [paddle, isLoading, error, openCheckout]);

  if (isLoading) {
    // Return empty div while loading instead of showing a loading message
    return <div id="paddle-checkout-loading"></div>;
  }

  if (error) {
    // Log the error but don't show it to the user
    console.error('Payment error:', error.message);
    // Close the payment popup immediately
    onClose();
    return null;
  }

  return <div id="paddle-checkout"></div>;
};
