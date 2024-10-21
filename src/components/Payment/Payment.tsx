import { initializePaddle, Paddle } from '@paddle/paddle-js';
import React, { useCallback, useEffect, useState } from 'react';
import { PADDLE_TOKEN, PADDLE_ENVIRONMENT, AppRoutes } from '~/constants';

interface PaymentProps {
  priceId: string;
  userId: string;
  email: string;
  countryCode: string;
  onError?: (error: Error) => void;
}

export const Payment: React.FC<PaymentProps> = ({
  priceId,
  userId,
  email,
  countryCode,
  onError,
}) => {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const openCheckout = useCallback(() => {
    if (paddle) {
      try {
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
          },
          settings: {
            displayMode: 'overlay',
            theme: 'light',
            locale: 'en',
            successUrl: `${window.location.origin}${AppRoutes.PaymentSuccess}`,
          },
        });
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to open checkout'),
        );
        onError?.(
          err instanceof Error ? err : new Error('Failed to open checkout'),
        );
      }
    }
  }, [paddle, priceId, email, countryCode, onError, userId]);

  useEffect(() => {
    const loadPaddle = async () => {
      try {
        setIsLoading(true);
        const paddleInstance = await initializePaddle({
          environment: PADDLE_ENVIRONMENT,
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
  }, [paddle, isLoading, error, openCheckout]);

  if (isLoading) {
    return <div>Loading payment gateway...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div id="paddle-checkout" />;
};
