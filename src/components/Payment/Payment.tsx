import { Environments, initializePaddle, Paddle } from '@paddle/paddle-js';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { PADDLE_TOKEN, PADDLE_ENVIRONMENT, AppRoutes } from '~/constants';

interface PaymentProps {
  priceId: string;
  userId: string;
  email: string;
  countryCode: string;
  onError?: (error: Error) => void;
  onClose: () => void;
}

interface PaddleCheckoutData {
  checkout: {
    id: string;
    completed: boolean;
  };
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
      // Make sure we mark checkout as closed on component unmount
      checkoutOpenedRef.current = false;
    };
  }, [paddle, isLoading, error, openCheckout]);

  if (isLoading) {
    return <div>Loading payment gateway...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div id="paddle-checkout"></div>;
};
