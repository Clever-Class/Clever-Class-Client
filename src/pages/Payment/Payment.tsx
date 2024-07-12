import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';

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

  // Callback to open a checkout
  const openCheckout = () => {
    paddle?.Checkout.open({
      items: [{ priceId: 'pri_01j2m6kcy7zrwey4j07dzgc5ea', quantity: 1 }],
    });
  };

  return (
    <div>
      <button onClick={openCheckout}>Open Checkout</button>
    </div>
  );
}
