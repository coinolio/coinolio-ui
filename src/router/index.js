import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
import Application from '@/pages/Application';
import Login from '@/pages/Login';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Application',
      component: Application,
      meta: {
        auth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (!store.state.authUser) {
      next({
          path: '/login'
      })
    } else {
        next()
    }
  } else {
    next()
  }
})

export default router;
