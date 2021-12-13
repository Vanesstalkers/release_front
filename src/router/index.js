import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/game/:id',
    name: 'Game',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/Game.vue')
    },
    // beforeEnter: (to, from, next) => {
    //   console.log("beforeEnter: (to, from, next) => {", {to});
    //   next();
    // }
  }
]

const router = new VueRouter({
  routes
})

export default router;