import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '~components/ui/button';
import { PADDLE_TOKEN } from '~constants';

export function Payment() {
  const { state } = useLocation();
  console.log(state);

  // Create a local state to store Paddle instance
  const [paddle, setPaddle] = useState<Paddle>();

  // Callback to open a checkout
  const openCheckout = useCallback(async () => {
    if (paddle) {
      paddle.Checkout.open({
        settings: {
          successUrl: 'http://localhost:5173/payment?success=true',
          displayMode: 'overlay',
          locale: 'en',
          allowedPaymentMethods: [
            'card',
            'paypal',
            'google_pay',
            'apple_pay',
            'ideal',
          ],
          frameTarget: 'checkout-container',
          frameInitialHeight: 450,
          frameStyle:
            'width: 100%; min-width: 312px; background-color: transparent; border: none;',
        },
        customData: {
          userId: state.user?.id,
        },

        items: [{ priceId: state.priceId, quantity: 1 }],
        customer: {
          email: state.user.email,
          address: {
            countryCode: state.countryCode,
          },
        },
      });
    }
  }, [paddle, state]);

  useEffect(() => {
    initializePaddle({
      environment: 'sandbox',
      token: PADDLE_TOKEN,
    })
      .then((paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
          openCheckout();
        }
      })
      .catch((error) => {
        console.error('Failed to initialize Paddle:', error);
      });
  }, [state, openCheckout]);

  return (
    <div>
      <Button onClick={openCheckout}>Open Checkout</Button>
      <div id="checkout-container" className="checkout-container"></div>
    </div>
  );
}
