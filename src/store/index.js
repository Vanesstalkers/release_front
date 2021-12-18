import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    pickedDice: null,
    availablePorts: [],
  },
  getters: {
    pickedDice: state => state.pickedDice,
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
  },
  mutations: {
    setPickedDice: (state, value) => {
      state.pickedDice = value;
    },
    setAvailablePorts: (state, value) => {
      state.availablePorts = value;
    },

    clearData: (state) => {
      Vue.set(state, 'forms', {});
      Vue.set(state, 'session', {});
      Vue.set(state, 'game', {});
      console.log("clearData end");
    },
    setSimple: (state, value) => {
      console.log("setSimple", { state, value });
      Object.entries(value).forEach(([key, val]) => {
        console.log("Vue.set", { key, val });
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
      //console.log("mutations setDeep", value);
      Object.entries(value).forEach(([key, val]) => {
        //console.log("key", key);
        if (!state[key]) Vue.set(state, key, {});
        Object.keys(val).forEach(id => {
          //console.log("id", id);
          Object.entries(val[id]).forEach(([k,v]) => {
            //console.log("k", k);
            const props = k.split('.');
            if (!state[key][id]) Vue.set(state[key], id, {});
            let itemPart = state[key][id];
            for(let i = 0; i < props.length - 1; i++){
              if(!itemPart[props[i]]) Vue.set(itemPart, props[i], {});
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
      console.log('setData', options);
      commit('setData', options);
    },
    async setDeep({ state, commit, dispatch }, options = {}) {
      console.log('setDeep', options);
      commit('setDeep', options);
    },
  },
  modules: {
  }
})
