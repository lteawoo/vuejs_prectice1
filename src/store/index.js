import Vue from 'vue'
import Vuex from 'vuex'
import snackbar from './snackbar'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editable: true,
    fireBaseUser: null,
    user: null
  },
  mutations: {
    setFireBaseUser (state, fireBaseUser) {
      state.fireBaseUser = fireBaseUser
    },

    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
  },
  modules: {
    snackbar: snackbar
  }
})
