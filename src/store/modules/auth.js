import {setToken, $get, $post} from '@/plugins/axios';

const state = {
  authUser: null,
  token: null
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
