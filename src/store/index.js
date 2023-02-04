import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    pickedDiceId: null,
    selectedDiceSideId: null,
    availablePorts: [],
  },
  getters: {
    pickedDiceId: state => state.pickedDiceId,
    selectedDiceSideId: state => state.selectedDiceSideId,
    availablePorts: state => state.availablePorts,

    getSimple: state => (id, col) => {
      return (col ? state[col]?.[id] : state[id]) || {};
    },
    getClone: state => (id, col) => {
      return JSON.parse(JSON.stringify((col ? state[col]?.[id] : state[id]) || {}));
    },
    getState: state => {
      return state;
    },
    currentSession: state => state.session?.[state.currentSession] || {},
    currentSessionGame: state => state.session?.[state.currentSession]?.data.game || null,
    gamePlaneCustomStyleData: state => state.gamePlaneCustomStyleData || {},
    currentPlayer: state => state.currentPlayer,
  },
  mutations: {
    setPickedDiceId: (state, value) => {
      state.pickedDiceId = value;
    },
    setSelectedDiceSideId: (state, value) => {
      state.selectedDiceSideId = value;
    },
    hideZonesAvailability: state => {
      Object.keys(state.zone).forEach(id => {
        if (state.zone[id].available) delete state.zone[id].available;
      });
    },
    setAvailablePorts: (state, value) => {
      state.availablePorts = value;
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
  },
  modules: {},
});
