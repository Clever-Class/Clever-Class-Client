import { api } from './api';

/**
 * Creates a Paddle checkout session
 * @param priceId - The Paddle price ID to checkout with
 * @returns Checkout URL
 */
export const createPaddleCheckout = async (priceId: string) => {
  try {
    const response = await api.ccServer.post(
      '/subscription/create-paddle-checkout',
      {
        priceId,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating Paddle checkout:', error);
    throw error;
  }
};

/**
 * Syncs subscription status with Paddle
 * @returns Success status
 */
export const syncPaddleSubscription = async () => {
  try {
    const response = await api.ccServer.post(
      '/subscription/sync-paddle-subscription',
    );
    return response.data;
  } catch (error) {
    console.error('Error syncing Paddle subscription:', error);
    throw error;
  }
};

/**
 * Gets subscription details
 * @returns Subscription details
 */
export const getSubscriptionDetails = async () => {
  try {
    const response = await api.ccServer.get(
      '/subscription/subscription-details',
    );
    return response.data;
  } catch (error) {
    console.error('Error getting subscription details:', error);
    throw error;
  }
};

/**
 * Cancels a subscription
 * @returns Success status
 */
export const cancelSubscription = async () => {
  try {
    const response = await api.ccServer.post('/subscription/cancel');
    return response.data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

/**
 * Pauses a subscription
 * @returns Success status
 */
export const pauseSubscription = async () => {
  try {
    const response = await api.ccServer.post('/subscription/pause');
    return response.data;
  } catch (error) {
    console.error('Error pausing subscription:', error);
    throw error;
  }
};

/**
 * Resumes a canceled subscription
 * @returns Success status
 */
export const resumeCanceledSubscription = async () => {
  try {
    const response = await api.ccServer.post('/subscription/resume-canceled');
    return response.data;
  } catch (error) {
    console.error('Error resuming subscription:', error);
    throw error;
  }
};
