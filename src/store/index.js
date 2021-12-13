import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    pickedDice: null,
  },
  getters: {
    pickedDice: state => {
      return state.pickedDice;
    },

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
  },
  mutations: {
    setPickedDice: (state, value) => {
      state.pickedDice = value;
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
      Object.entries(value).forEach(([key, val]) => {
        if (!state[key]) Vue.set(state, key, {});
        Object.keys(val).forEach(id => {

          Object.entries(val[id]).forEach(([k,v]) => {
            const props = k.split('.');
            let itemPart = state[key][id];
            for(let i = 0; i < props.length - 1; i++){
              if(!itemPart[props[i]]) Vue.set(itemPart, props[i], {});
              itemPart = itemPart[props[i]];
            }
            Vue.set(itemPart, props[props.length - 1], v);
            //console.log({k,v, props});
          });

          //console.log('set deep', key, id, val[id]);
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
