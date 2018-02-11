import Vue from 'vue';
import Vuex from 'vuex';

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
  }
});
