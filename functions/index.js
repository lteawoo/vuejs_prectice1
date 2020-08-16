const functions = require('firebase-functions')

var admin = require('firebase-admin')

var serviceAccount = require('./key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().admin.db_url // 'https://taeu-vue-precties1.firebaseio.com'
})

const db = admin.database()
const firestore = admin.firestore()

exports.createUser = functions.auth
  .user()
  .onCreate(async (user) => {
    const { uid, email, displayName, photoURL } = user
    const now = new Date()
    const data = {
      email,
      displayName,
      photoURL,
      createdAt: now.getMilliseconds(),
      level: email === functions.config().admin.email ? 0 : 5
    }
    await firestore.collection('users').doc(uid).set(data)
    data.createdAt = now.getTime()
    db.ref('users').child(uid).set(data)
  })

exports.deleteUser = functions.auth
  .user()
  .onDelete(async (user) => {
    const { uid } = user
    await db.ref('users').child(uid).remove()
    await firestore.collection('users').doc(uid).delete()
  })

exports.increamentBoardCount = functions.firestore.document('boards/{boardId}')
  .onCreate(async (snap, context) => {
    try {
      await firestore.collection('meta')
        .doc('boards')
        .update({
          count: admin.firestore.FieldValue.increment(1)
        })
    } catch (e) {
      await firestore.collection('meta')
        .doc('boards')
        .set({ count: 1 })
    }
  })

exports.decrementBoardCount = functions.firestore.document('boards/{boardId}')
  .onDelete(async (snap, context) => {
    await firestore.collection('meta')
      .doc('boards')
      .update({
        count: admin.firestore.FieldValue.increment(-1)
      })
  })
