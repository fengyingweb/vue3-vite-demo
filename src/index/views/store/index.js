import { createStore } from 'vuex'

const store = createStore({
  state: {
    showNewKine: false
  },
  mutations: {
    updateNewKine(state, payload) {
      state.showNewKine = payload.value
    }
  },
  actions: {}
})

export default store
