import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import Dashboard from '@/pages/Dashboard';
import Trades from '@/pages/Trades';
import Exchanges from '@/pages/Exchanges';
import Plugins from '@/pages/Plugins';
import Events from '@/pages/Events';
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
    },
    {
      path: '/exchanges',
      name: 'Exchanges',
      component: Exchanges,
      meta: {
        auth: true
      }
    },
    {
      path: '/plugins',
      name: 'Plugins',
      component: Plugins,
      meta: {
        auth: true
      }
    },
    {
      path: '/events',
      name: 'Events',
      component: Events,
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
