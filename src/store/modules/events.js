import {$get, $post, $put, $del} from '@/plugins/axios';

const state = {
  userEvents: [],
  selectedEvent: null
};

const getters = {
  events: (state) => {
    return state.userEvents;
  },
  enabledEvents: (state) => {
    return state.userEvents.filter((e) => {
      return e.enabled;
    });
  }
};

const mutations = {
  setUserEvents: function(state, events) {
    state.userEvents = events;
  },
  updateEvent: function(state, {index, event}) {
    state.userEvents.splice(index, 1, event);
  },
  addEvent: function(state, event) {
    state.userEvents.push(event);
  },
  setSelectedEvent(state, content) {
    state.selectedEvent = content;
  },
  removeEvent: function(state, eventId) {
    const eventIndex = state.userEvents.findIndex((c) => {
      return c.id === eventId;
    });
    state.userEvents.splice(eventIndex, 1);
  }
};

const actions = {
  fetchEvents({commit}) {
    return $get('/events')
      .then((res) => {
        commit('setUserEvents', res);
      })
      .catch((error) => {
        throw new Error(JSON.stringify(error));
      });
  },

  fetchEvent({commit}, id) {
    return $get(`/events/${id}`)
      .then((res) => {
        commit('setSelectedEvent', res);
      })
      .catch((error) => {
        throw new Error(JSON.stringify(error));
      });
  },

  addEvent({commit}, event) {
    return $post('/events', event)
      .then((res) => {
        commit('addEvent', res);
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  editEvent: function({commit, state}, event) {
    return $put(`/events/${event.id}`, event)
      .then((res) => {
        const index = state.userEvents.findIndex((p) => {
          return p.id === event.id;
        });
        commit('updateEvent', {index, event: res});
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  removeEvent({commit}, eventId) {
    return $del(`/events/${eventId}`)
      .then((res) => {
        commit('removeEvent', eventId);
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
