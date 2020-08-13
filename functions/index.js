const functions = require('firebase-functions')

var admin = require('firebase-admin')

var serviceAccount = require('./key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://taeu-vue-precties1.firebaseio.com'
})

const db = admin.database()

exports.createUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user
  const data = {
    email,
    displayName,
    photoURL,
    createdAt: new Date()
  }
  db.ref('users').child(uid).set(data)
})

exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  const { uid } = user
  db.ref('users').child(uid).remove()
})
