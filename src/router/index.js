import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import Dashboard from '@/pages/Dashboard';
import Trades from '@/pages/Trades';
import Login from '@/pages/Login';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        auth: true
      }
    },
    {
      path: '/trades',
      name: 'Trades',
      component: Trades,
      meta: {
        auth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.auth)) {
    if (!store.state.auth.token) {
      next({
        path: '/login'
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
