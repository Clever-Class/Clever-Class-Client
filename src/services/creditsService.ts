import { api } from '~api';
import store from '~store';
import { updateUserCredits } from '~/store/actions/authActions';

// Service to manage credits updates
export const creditsService = {
  /**
   * Refresh user credits from the server
   * This should be called after any API that consumes credits
   */
  refreshCredits: async (): Promise<void> => {
    try {
      const { data } = await api.ccServer.get('/auth/me');

      if (data?.user?.trialCredits !== undefined) {
        // Dispatch action to update Redux store with new credit amount
        store.dispatch(updateUserCredits(data.user.trialCredits));
      }
    } catch (error) {
      console.error('Failed to refresh user credits:', error);
    }
  },
};
