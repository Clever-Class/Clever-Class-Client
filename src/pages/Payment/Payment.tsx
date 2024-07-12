import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';
import { Button } from '~components/ui/button';

export function Payment() {
  // Create a local state to store Paddle instance
  const [paddle, setPaddle] = useState<Paddle>();

  // Download and initialize Paddle instance from CDN
  useEffect(() => {
    initializePaddle({
      environment: 'sandbox',
      token: 'test_bbfe3b32ee5efc15d8d0619fc1b',
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

  // Update Paddle instance
  const updateCheckout = async () => {
    paddle?.Update({
      pwCustomer: {
        id: 'abir@gmail.com',
      },
    });
  };

  // Callback to open a checkout
  const openCheckout = async () => {
    paddle?.Checkout.open({
      settings: {
        displayMode: 'inline',
        locale: 'en',
        allowedPaymentMethods: ['card', 'paypal', 'google_pay', 'apple_pay'],
        frameTarget: 'checkout-container',
        frameInitialHeight: 450,
        frameStyle:
          'width: 100%; min-width: 312px; background-color: transparent; border: none;',
      },
      items: [{ priceId: 'pri_01j2m6kcy7zrwey4j07dzgc5ea', quantity: 1 }],

      // customer
      customer: {
        email: 'abirhossainjuhan@gmail.com',
        address: {
          countryCode: 'BD',
        },
      },
    });
  };

  return (
    <div>
      <Button onClick={updateCheckout}>Update Paddle</Button>
      <Button onClick={openCheckout}>Open Checkout</Button>
      <div className="checkout-container"></div>
    </div>
  );
}
