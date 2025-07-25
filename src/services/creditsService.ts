import { api } from '~api';
import store from '~store';
import {
  updateUserCredits,
  updateUserFromMe,
} from '~/store/actions/authActions';

// Service to manage credits updates
export const creditsService = {
  /**
   * Refresh user credits from the server
   * This should be called after any API that consumes credits
   */
  refreshCredits: async (): Promise<void> => {
    try {
      const { data } = await api.ccServer.get('/auth/me');

      if (data?.user && data?.subscription) {
        // Dispatch action to update full user data including credits
        store.dispatch(updateUserFromMe(data.user, data.subscription));
      } else if (data?.user?.trialCredits !== undefined) {
        // Fallback to just updating credits if that's all we have
        store.dispatch(updateUserCredits(data.user.trialCredits));
      }
    } catch (error) {
      console.error('Failed to refresh user credits:', error);
    }
  },

  /**
   * Get current user credits from Redux store
   * @returns number of credits or 0 if not available
   */
  getUserCredits: (): number => {
    const state = store.getState();
    return state.user?.user?.trialCredits || 0;
  },
};
