import { defineStore } from 'pinia';
import { WebStorageKeys } from '~/lib/values/general.values';

export const usePoapDropStore = defineStore('poapDrop', {
  state: () => ({
    poapDrops: undefined,
    poapDrop: undefined,
    dropReservations: undefined,
  }),

  getters: {
    poaps(state) {
      return state.poapDrops;
    },
    poap(state) {
      return state.poapDrop;
    },
    reservations(state) {
      return state.dropReservations;
    },
  },

  actions: {
    async getPoapDrops() {
      try {
        // Get poap drops
        const poapDropsApiResponse = await $api.get('/poap-drops');
        this.poapDrops = (poapDropsApiResponse as any).data;
      } catch (e: any) {
        console.error(e);
      }
    },
    async getPoapDrop(dropId) {
      try {
        // Get poap drop
        const poapDropApiResponse = await $api.get(`/poap-drops/${dropId}`);
        this.poapDrop = (poapDropApiResponse as any).data;
      } catch (e: any) {
        console.error(e);
      }
    },
    async getPoapDropReservations(dropId) {
      try {
        // Get poap drop reservations
        const dropReservationsApiResponse = await $api.get(
          `/poap-drops/${dropId}/drop-reservations`
        );
        this.dropReservations = (dropReservationsApiResponse as any).data;
      } catch (e: any) {
        console.error(e);
      }
    },
  },

  persist: {
    key: WebStorageKeys.USER,
    storage: persistedState.localStorage,
    paths: ['jwt', 'userId', 'username', 'email'],
  },
});
