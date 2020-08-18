<template>
  <v-card>
    <v-card-title>
      <v-text-field v-model="comment" outlined label="댓글 작성" @keypress.enter="save" hide-details></v-text-field>
    </v-card-title>
    <template v-for="(item, i) in items">
      <v-list-item :key="item.id">
        <v-list-item-action>
          <display-user :user="item.user"></display-user>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-subtitle v-text="item.comment"></v-list-item-subtitle>
          <v-list-item-subtitle>
            <display-time :time="item.createdAt"></display-time>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider :key="i"></v-divider>
    </template>
    <v-list-item>
      <v-btn @click="more" text color="primary" block>더보기</v-btn>
    </v-list-item>
  </v-card>
</template>

<script>
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'

export default {
  components: {
    DisplayTime,
    DisplayUser
  },

  props: ['docRef'],

  data () {
    return {
      comment: '',
      items: [],
      unsubscribe: null,
      limit: 5
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    }
  },

  created () {
    this.subscribe()
  },

  destroyed () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },

  methods: {
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()

      this.unsubscribe = this.docRef.collection('comments')
        .limit(this.limit)
        .orderBy('createdAt', 'desc')
        .onSnapshot(sn => {
          if (sn.empty) {
            this.items = []
            return
          }

          this.items = sn.docs.map(doc => {
            const docData = doc.data()
            return {
              id: doc.id,
              createdAt: docData.createdAt.toDate(),
              updatedAt: docData.updatedAt.toDate(),
              comment: docData.comment,
              user: docData.user
            }
          })
        })
    },

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
    },

    more () {
      this.limit += 5
      this.subscribe()
    }
  }
}
</script>
