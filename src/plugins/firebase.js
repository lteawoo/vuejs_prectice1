import Vue from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-database'
import 'firebase/firebase-firestore'
import 'firebase/firebase-storage'
import firebaseConfig from '../../firebaseConfig'
import store from '../store/'

firebase.initializeApp(firebaseConfig)
let unsubscribe = null

const subscribe = (user) => {
  const ref = firebase.firestore().collection('users').doc(user.uid)

  unsubscribe = ref.onSnapshot(doc => {
    const userData = doc.data()
    userData.id = doc.id

    if (doc.exists) {
      store.commit('setUser', userData)
    }
  }, console.error)
}

firebase.auth().onAuthStateChanged((user) => {
  store.commit('setFireBaseUser', user)

  if (!user) {
    store.commit('setUser', null)

    if (unsubscribe) {
      unsubscribe()
    }
    return
  }

  subscribe(user)
})

Vue.prototype.$firebase = firebase
