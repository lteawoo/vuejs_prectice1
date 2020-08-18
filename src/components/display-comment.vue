<template>
  <v-card>
    <v-card-title>
      <v-text-field v-model="comment" outlined label="댓글 작성" @keypress.enter="save" hide-details></v-text-field>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: ['docRef'],

  data () {
    return {
      comment: ''
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    }
  },

  methods: {
    async save () {
      try {
        await this.$firebase.firestore()
          .runTransaction(t => t.get(this.docRef)
            .then(async article => {
              const now = new Date()

              const doc = {
                createdAt: now,
                updatedAt: now,
                comment: this.comment,
                user: {
                  uid: this.$store.state.fireBaseUser.uid,
                  email: this.user.email,
                  photoURL: this.user.photoURL,
                  displayName: this.user.displayName
                }
              }

              const comments = await this.docRef.collection('comments').get()
              const docs = comments.docs
              const nextId = comments.empty ? 0 : Math.max(...docs.map(comment => comment.id))

              t.set(this.docRef.collection('comments').doc(String(nextId + 1)), doc)

              t.update(this.docRef, {
                commentCount: docs.length + 1
              })
            }))
      } finally {
        console.log('finish')
      }
    }
  }
}
</script>
