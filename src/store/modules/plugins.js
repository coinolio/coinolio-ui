import {$get, $post, $put, $del} from '@/plugins/axios';

const state = {
  userPlugins: [],
  selectedPlugin: null
};

const getters = {
  plugins: (state) => {
    return state.userPlugins;
  },
  enabledPlugins: (state) => {
    return state.userPlugins.filter((e) => {
      return e.enabled;
    });
  }
};

const mutations = {
  setUserPlugins: function(state, plugins) {
    state.userPlugins = plugins;
  },
  updatePlugin: function(state, {index, plugin}) {
    state.userPlugins.splice(index, 1, plugin);
  },
  addPlugin: function(state, plugin) {
    state.userPlugins.push(plugin);
  },
  setSelectedPlugin(state, content) {
    state.selectedPlugin = content;
  },
  removePlugin: function(state, pluginId) {
    const pluginIndex = state.userPlugins.findIndex((c) => {
      return c.id === pluginId;
    });
    state.userPlugins.splice(pluginIndex, 1);
  }
};

const actions = {
  fetchPlugins({commit}) {
    return $get('/plugins')
      .then((res) => {
        commit('setUserPlugins', res);
      })
      .catch((error) => {
        throw new Error(JSON.stringify(error));
      });
  },

  fetchPlugin({commit}, id) {
    return $get(`/plugins/${id}`)
      .then((res) => {
        commit('setSelectedPlugin', res);
      })
      .catch((error) => {
        throw new Error(JSON.stringify(error));
      });
  },

  addPlugin({commit}, plugin) {
    return $post('/plugins', plugin)
      .then((res) => {
        commit('addPlugin', res);
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  editPlugin: function({commit, state}, plugin) {
    return $put(`/plugins/${plugin.id}`, plugin)
      .then((res) => {
        const index = state.userPlugins.findIndex((p) => {
          return p.id === plugin.id;
        });
        commit('updatePlugin', {index, plugin: res});
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  removePlugin({commit}, pluginId) {
    return $del(`/plugins/${pluginId}`)
      .then((res) => {
        commit('removePlugin', pluginId);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
