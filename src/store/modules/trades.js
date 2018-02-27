import {$get, $post, $put, $del} from '@/plugins/axios';

const state = {
  userTrades: [],
  selectedTrade: null
};
const getters = {
  trades: (state) => {
    return state.userTrades;
  }
};

const mutations = {
  setUserTrades: function(state, trades) {
    state.userTrades = trades;
  },
  updateTrade: function(state, {index, trade}) {
    state.userTrades.splice(index, 1, trade);
  },
  addTrade: function(state, photo) {
    state.userTrades.push(photo);
  },
  setSelectedTrade(state, tradeId) {
    state.selectedTrade = tradeId;
  },
  removeTrade: function(state, tradeId) {
    const tradeIndex = state.userTrades.findIndex((c) => {
      return c.id === tradeId;
    });
    state.userTrades.splice(tradeIndex, 1);
  }
};

const actions = {
  fetchTrades({commit}) {
    return $get('/trades')
      .then((res) => {
        commit('setUserTrades', res);
      })
      .catch((error) => {
        throw new Error(JSON.stringify(error));
      });
  },

  addTrade({commit}, trade) {
    return $post('/trades', trade)
      .then((res) => {
        commit('addTrade', res);
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  editTrade: function({commit, state}, trade) {
    return $put(`/trades/${trade.id}`, trade)
      .then((res) => {
        const index = state.userTrades.findIndex((p) => {
          return p.id === trade.id;
        });
        commit('updateTrade', {index, trade: res});
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  editTradeParent: function({commit, state}, trade) {
    const updateTrade = state.userTrades.find((p) => {
      return p.id === trade.id;
    });
    return $put(`/trades/${trade.id}`, {
      id: updateTrade.id,
      title: updateTrade.title,
      description: updateTrade.description,
      parent: trade.parent,
      visibility: updateTrade.visibility
    })
      .then((res) => {
        const index = state.userTrades.findIndex((p) => {
          return p.id === trade.id;
        });
        commit('updateTrade', {index, trade: res});
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  removeTrade({commit}, tradeId) {
    return $del(`/trades/${tradeId}`)
      .then((res) => {
        commit('removeTrade', tradeId);
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
