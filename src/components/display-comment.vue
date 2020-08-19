<template>
  <v-card>
    <v-card-title>
      <v-textarea v-model="comment" rows="3" outlined label="댓글 작성" append-icon="mdi-send" @click:append="save"  hide-details></v-textarea>
    </v-card-title>
    <template v-for="(item, i) in items">
      <v-list-item :key="'comment' + item.id">
        <v-list-item-action>
          <display-user :user="item.user"></display-user>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-subtitle class="black--text comment" v-text="item.comment"></v-list-item-subtitle>
          <v-list-item-subtitle class="font-italic">
            <display-time :time="item.createdAt"></display-time>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider :key="i"></v-divider>
    </template>
    <v-list-item>
      <v-btn
        v-if="lastDoc && items.length < article.commentCount"
        @click="more"
        text
        color="primary"
        block
        v-intersect="onInstersect"
      >
        더보기
      </v-btn>
    </v-list-item>
  </v-card>
</template>

<script>
import { last } from 'lodash'
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'
const LIMIT = 5

export default {
  components: {
    DisplayTime,
    DisplayUser
  },

  props: ['docRef', 'article'],

  data () {
    return {
      comment: '',
      items: [],
      unsubscribe: null,
      lastDoc: null
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
        .orderBy('createdAt', 'desc')
        .limit(LIMIT)
        .onSnapshot(sn => {
          if (sn.empty) {
            this.items = []
            return
          }

          this.snapshotToItems(sn)
        })
    },

    snapshotToItems (sn) {
      this.lastDoc = last(sn.docs)

      sn.docs.forEach(doc => {
        const exists = this.items.some(item => doc.id === item.id)

        if (!exists) {
          const docData = doc.data()

          this.items.push({
            id: doc.id,
            createdAt: docData.createdAt.toDate(),
            updatedAt: docData.updatedAt.toDate(),
            comment: docData.comment,
            user: docData.user
          })
        }
      })

      this.items.sort((before, after) => {
        const beforeId = before.id
        const afterId = after.id

        return afterId - beforeId
      })
    },

    async more () {
      if (!this.lastDoc) throw Error('더이상 데이터가 없습니다.')

      const sn = await this.docRef.collection('comments')
        .limit(LIMIT)
        .orderBy('createdAt', 'desc')
        .startAfter(this.lastDoc)
        .get()

      this.snapshotToItems(sn)
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

    onInstersect (entries, observer, isIntersecting) {
      if (isIntersecting) this.more()
    }
  }
}
</script>

<style scoped>
  .comment {
    white-space: pre-wrap;
  }
</style>
