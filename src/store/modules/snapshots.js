import {$get, $post, $put, $del} from '@/plugins/axios';

const state = {
  userSnapshots: [],
  selectedSnapshot: null
};

const getters = {
  snapshots: (state) => {
    return state.userSnapshots;
  }
};

const mutations = {
  setUserSnapshots: function(state, snapshots) {
    state.userSnapshots = snapshots;
  },
  updateSnapshot: function(state, {index, snapshot}) {
    state.userSnapshots.splice(index, 1, snapshot);
  },
  addSnapshot: function(state, photo) {
    state.userSnapshots.push(photo);
  },
  setSelectedSnapshot(state, content) {
    state.selectedSnapshot = content;
  },
  removeSnapshot: function(state, snapshotId) {
    const snapshotIndex = state.userSnapshots.findIndex((c) => {
      return c.id === snapshotId;
    });
    state.userSnapshots.splice(snapshotIndex, 1);
  }
};

const actions = {
  fetchSnapshots({commit}) {
    return $get('/snapshots', {
      params: {
        limit: 720
      }
    })
      .then((res) => {
        commit('setUserSnapshots', res);
      })
      .catch((error) => {
        throw new Error(JSON.stringify(error));
      });
  },

  fetchSnapshot({commit}, id) {
    return $get(`/snapshots/${id}`)
      .then((res) => {
        commit('setSelectedSnapshot', res);
      })
      .catch((error) => {
        throw new Error(JSON.stringify(error));
      });
  },

  addSnapshot({commit}, snapshot) {
    return $post('/snapshots', snapshot)
      .then((res) => {
        commit('addSnapshot', res);
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  editSnapshot: function({commit, state}, snapshot) {
    return $put(`/snapshots/${snapshot.id}`, snapshot)
      .then((res) => {
        const index = state.userSnapshots.findIndex((p) => {
          return p.id === snapshot.id;
        });
        commit('updateSnapshot', {index, snapshot: res});
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  removeSnapshot({commit}, snapshotId) {
    return $del(`/snapshots/${snapshotId}`)
      .then((res) => {
        commit('removeSnapshot', snapshotId);
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
