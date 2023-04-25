import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    store: {},
    pickedDiceId: null,
    selectedDiceSideId: null,
    availablePorts: [],
    helperLinksBounds: {},
    shownCard: null,
  },
  getters: {
    isMobile: state => state.isMobile,
    guiScale: state => state.guiScale,
    isLandscape: state => state.isLandscape,
    currentUser: state => state.currentUser,
    sessionPlayerId: state => state.sessionPlayerId,
    sessionPlayerIsActive: state =>
      state.sessionPlayerId ===
      Object.keys((state.store.game?.[state.gameId] || {}).playerMap || {}).find(
        id => state.store.player?.[id]?.active,
      ),
    currentRound: state => (state.store.game?.[state.gameId] || {}).round,
    actionsDisabled: state => state.store.player?.[state.sessionPlayerId]?.eventData?.actionsDisabled,
    pickedDiceId: state => state.pickedDiceId,
    selectedDiceSideId: state => state.selectedDiceSideId,
    availablePorts: state => state.availablePorts,
    helperLinksBounds: state => state.helperLinksBounds,
    shownCard: state => state.shownCard,

    getSimple: state => (id, col) => {
      return (col ? state[col]?.[id] : state[id]) || {};
    },
    getStore: state => (id, col) => {
      return (col ? state.store[col]?.[id] : state.store[id]) || {};
    },
    getClone: state => (id, col) => {
      return JSON.parse(JSON.stringify((col ? state[col]?.[id] : state[id]) || {}));
    },
    getState: state => {
      return state;
    },
    gamePlaneCustomStyleData: state => state.gamePlaneCustomStyleData || {},
    getHelperLinks: (state, getters) => {
      const links = getters.getStore(getters.currentUser, 'user').helperLinks || {};
      const currentGame = localStorage.getItem('currentGame');
      return Object.fromEntries(
        Object.entries(links).filter(
          ([code, link]) => link.used !== true && link.type === (currentGame ? 'game' : 'lobby'),
        ),
      );
    },
  },
  mutations: {
    setPickedDiceId: (state, value) => {
      state.pickedDiceId = value;
    },
    setSelectedDiceSideId: (state, value) => {
      state.selectedDiceSideId = value;
    },
    hideZonesAvailability: state => {
      Object.keys(state.store.zone).forEach(id => {
        if (state.store.zone[id].available) state.store.zone[id].available = false;
      });
    },
    setAvailablePorts: (state, value) => {
      state.availablePorts = value;
    },
    setShownCard: (state, value) => {
      state.shownCard = value;
    },

    clearData: state => {
      Vue.set(state, 'forms', {});
      Vue.set(state, 'session', {});
      Vue.set(state, 'game', {});
      console.log('clearData end');
    },
    setSimple: (state, value) => {
      Object.entries(value).forEach(([key, val]) => {
        Vue.set(state, key, val);
      });
    },
    setData: (state, value) => {
      Object.entries(value).forEach(([key, val]) => {
        if (!state[key]) Vue.set(state, key, {});
        Object.keys(val).forEach(id => {
          Vue.set(state[key], id, val[id]);
        });
      });
    },
    setDeep: (state, value) => {
      Object.entries(value).forEach(([key, val]) => {
        if (!state[key]) Vue.set(state, key, {});
        Object.keys(val).forEach(id => {
          Object.entries(val[id]).forEach(([k, v]) => {
            const props = k.split('.');
            if (!state[key][id]) Vue.set(state[key], id, {});
            let itemPart = state[key][id];
            for (let i = 0; i < props.length - 1; i++) {
              if (!itemPart[props[i]]) Vue.set(itemPart, props[i], {});
              itemPart = itemPart[props[i]];
            }
            Vue.set(itemPart, props[props.length - 1], v);
          });
        });
      });
    },
    setStore: (state, value) => {
      const store = state.store;
      Object.entries(value).forEach(([key, val]) => {
        if (!store[key]) store[key] = {};
        Object.keys(val).forEach(id => {
          Object.entries(val[id]).forEach(([k, v]) => {
            const props = k.split('.');
            if (!store[key][id]) store[key][id] = {};
            let itemPart = store[key][id];
            for (let i = 0; i < props.length - 1; i++) {
              if (!itemPart[props[i]]) Vue.set(itemPart, props[i], {});
              itemPart = itemPart[props[i]];
            }
            Vue.set(itemPart, props[props.length - 1], v);
          });
        });
      });
      Vue.set(state, 'store', { ...store });
    },
  },
  actions: {
    async setSimple({ state, commit, dispatch }, options = {}) {
      commit('setSimple', options);
    },
    async setData({ state, commit, dispatch }, options = {}) {
      // console.log('setData', options);
      commit('setData', options);
    },
    async setDeep({ state, commit, dispatch }, options = {}) {
      // console.log('setDeep', options);
      commit('setDeep', options);
    },
    async setStore({ state, commit, dispatch }, options = {}) {
      // console.log('setStore', options);
      commit('setStore', options);
    },
  },
  modules: {},
});
