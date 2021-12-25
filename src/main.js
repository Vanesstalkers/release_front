import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'
import store from './store'
window.vuex = store;

import { Metacom } from '../lib/metacom.js';

Vue.config.productionTip = false

const init = async () => {

  const protocol = location.protocol === 'http:' ? 'ws' : 'wss';
  const metacom = Metacom.create(`${protocol}://localhost:8000`)
  const { api } = metacom;
  window.api = api;

  await metacom.load('auth'); // Load `auth` interface

  const token = localStorage.getItem('metarhia.session.token');
  let logged = false, currentGame, currentPlayer, currentSession;

  if (token) {
    const res = await api.auth.restore({ token });
    if( res.status != 'ok' ){
      //alert(res.msg);
      //return;
    }else{
      logged = true;
      currentSession = res.session;
      currentGame = res.game || '';
      currentPlayer = res.player || '';
      localStorage.setItem('currentGame', currentGame);
      store.dispatch('setSimple', {currentPlayer});
    }
  }
  if (!logged) {
    //const res = await api.auth.signin({ login: 'marcus', password: 'marcus' });
    const res = await api.auth.signin({ demo: true });
    if( !(res.status == 'ok' && res.token) ){
      alert(res.msg);
      return;
    }else{
      localStorage.setItem('metarhia.session.token', res.token);
      currentSession = res.session;
    }
  }

  await metacom.load('example', 'db', 'chat', 'session', 'lobby', 'game', 'subscribe');

  router.beforeEach((to, from, next) => {
    const currentGame = localStorage.getItem('currentGame');
    console.log("router.beforeEach", {to, from, currentGame});
    if(to.name === 'Game'){
      if(!currentGame) return next({name: 'Home'});
    }else{
      if(currentGame) return next({name: 'Game', params: { id: currentGame }});
    }
    return next();
  })

  new Vue({
    router,
    store,
    render: function (h) { return h(App) },
  }).$mount('#app');

  store.dispatch('setSimple', {currentSession});

  api.db.on('updated', (data)=>{
    store.dispatch('setData', data);
  });
  api.db.on('smartUpdated', (data)=>{
    store.dispatch('setDeep', data);
  });

  api.session.on('joinGame', (data)=>{
    localStorage.setItem('currentGame', data.gameId);
    store.dispatch('setSimple', {currentPlayer: data.playerId});
    router.push({ path: `/game/${data.gameId}` });
  });
  api.session.on('leaveGame', ()=>{
    localStorage.setItem('currentGame', '');
    router.push({ path: `/` });
  });
};

init();