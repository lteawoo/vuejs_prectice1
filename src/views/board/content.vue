<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="accent" dense flat dark>
        <v-toolbar-title v-text="info.name"></v-toolbar-title>

        <v-spacer/>
        <template v-if="user">
          <v-btn icon @click="write" :disabled="user.level > 0">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="writeArticle" :disabled="user.level > 4">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-card-text v-if="info.createdAt">
        <v-alert color="info" outlined dismissible>
          <div style="white-space: pre-line">{{info.description}}</div>
          <div class="text-right font-italic caption">작성일: {{info.createdAt.toDate().toLocaleString()}}</div>
          <div class="text-right font-italic caption">수정일: {{info.updatedAt.toDate().toLocaleString()}}</div>
        </v-alert>
      </v-card-text>
      <board-article :articleCount="info.articleCount" :document="document"></board-article>
    </v-card>
  </v-container>
</template>

<script>
import BoardArticle from './article/index'

export default {
  components: { BoardArticle },
  props: ['document'],

  data () {
    return {
      unsubscribe: null,

      info: {
        articleCount: 0,
        category: '',
        name: '',
        description: '',
        createdAt: '',
        updatedAt: ''
      },

      loading: false
    }
  },

  watch: {
    document () {
      this.subscribe()
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
    if (this.unsubscribe) this.unsubscribe()
  },

  methods: {
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()

      const ref = this.$firebase.firestore().collection('boards').doc(this.document)

      this.unsubscribe = ref.onSnapshot(doc => {
        if (!doc.exists) {
          return this.write()
        }
        this.info = doc.data()
      })
    },

    async write () {
      this.$router.push(this.$route.path + '/board-write')
    },

    async writeArticle () {
      this.$router.push({
        path: this.$route.path + '/article-write',
        query: {
          id: ''
        }
      })
    }
  }
}
</script>
