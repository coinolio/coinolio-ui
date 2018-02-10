import {setToken, $get, $post} from '@/plugins/axios';
const inBrowser = typeof window !== 'undefined';
import tough from 'tough-cookie';
const Cookie = tough.Cookie;
const cookiejar = new tough.CookieJar();

const state = {
  authUser: null
};

const mutations = {
  setUser: function(state, user) {
    state.authUser = user;
  },

  setToken: function(state, token) {
    state.token = token;

    // Setup axios
    setToken(token);
  }
};

const actions = {
  nuxtServerInit({commit}, {req}) {
    if (req.cookies) {
      if (req.cookies.user) {
        commit('setUser', req.cookies.user);

        if (req.cookies.user.token) {
          commit('setToken', req.cookies.user.token);
        }
      }
    }
  },

  fetchUser({commit, state}) {
    if (state.authUser) {
      commit('setToken', state.authUser.token);
    }
  },

  login({commit}, {username, password}) {
    return $post('/auth/login', {
      username,
      password
    })
      .then((res) => {
        if (inBrowser) {
          cookiejar.setCookie(Cookie.fromJSON({user: res, token: res.token}), '', (err, cookie) => {});
        }

        commit('setUser', res);
        commit('setToken', res.token);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          throw new Error('Bad credentials');
        }
      });
  },

  logout({commit}) {
    return $get('/auth/logout')
      .then(() => {
        commit('setUser', null);
        commit('setToken', null);
      });
  }
};

export default {
  state,
  actions,
  mutations
};
