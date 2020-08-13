import Vue from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-database'
import firebaseConfig from '../../firebaseConfig'
import store from '../store/'

firebase.initializeApp(firebaseConfig)
firebase.auth().onAuthStateChanged((user) => {
  console.log(user)
  return store.commit('setFireBaseUser', user)
})

Vue.prototype.$firebase = firebase
