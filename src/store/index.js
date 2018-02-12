import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';

import auth from './modules/auth';
import trades from './modules/trades';
import snapshots from './modules/snapshots';
import exchanges from './modules/exchanges';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    trades,
    snapshots,
    exchanges
  },
  plugins: [createPersistedState({
    storage: {
      getItem: (key) => Cookies.get(key),
      setItem: (key, value) => Cookies.set(key, value, {expires: 3}),
      removeItem: (key) => Cookies.remove(key)
    }
  })]
});
