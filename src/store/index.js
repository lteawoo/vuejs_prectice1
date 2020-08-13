import Vue from 'vue'
import Vuex from 'vuex'
import snackbar from './snackbar'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editable: true,
    fireBaseUser: null
  },
  mutations: {
    setFireBaseUser (state, fireBaseUser) {
      state.fireBaseUser = fireBaseUser
    }
  },
  actions: {
  },
  modules: {
    snackbar: snackbar
  }
})
