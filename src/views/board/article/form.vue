<template>
  <v-container fluid>
    <v-card :loading="loading">
      <v-toolbar color="accent" dense flat dark>
        <v-toolbar-title>게시판 글 작성</v-toolbar-title>

        <v-spacer/>
        <v-btn icon @click="back"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <v-btn icon @click="write" v-if="!articleId" :hidden="!user" :disabled="!user"><v-icon>mdi-content-save</v-icon></v-btn>
        <v-btn icon @click="update" v-else :hidden="!user" :disabled="!user"><v-icon>mdi-file-document-edit</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field v-model="form.title" outlined label="제목"></v-text-field>
        <editor ref="editor"></editor>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ['document', 'action'],

  data () {
    return {
      form: {
        title: '',
        content: ''
      },
      loading: false,
      exists: false,
      ref: null
    }
  },

  computed: {
    articleId () {
      return this.$route.query.id
    },

    user () {
      return this.$store.state.user
    }
  },

  created () {
    this.read()
  },

  methods: {
    async read () {
      this.ref = this.$firebase.firestore()
        .collection('boards')
        .doc(this.document)

      if (!this.articleId) return

      const article = await this.ref
        .collection('articles')
        .doc(this.articleId)
        .get()

      if (article.exists) {
        const data = article.data()
        this.form.title = data.title
        this.form.content = data.content
        this.$refs.editor.invoke('setMarkdown', data.content)
      }
    },

    async write () {
      this.loading = true

      try {
        await this.$firebase.firestore()
          .runTransaction(t => {
            return t.get(this.ref)
              .then(async board => {
                const now = new Date()
                const doc = {
                  title: this.form.title,
                  createdAt: now,
                  updatedAt: now,
                  commentCount: 0,
                  readCount: 0,
                  user: {
                    uid: this.$store.state.fireBaseUser.uid,
                    email: this.user.email,
                    photoURL: this.user.photoURL,
                    displayName: this.user.displayName
                  },
                  content: this.$refs.editor.invoke('getMarkdown')
                }

                const articles = await this.ref.collection('articles').get()
                const docs = articles.docs
                const nextId = articles.empty ? 0 : Math.max(...docs.map(article => {
                  return article.id
                }))

                t.set(this.ref.collection('articles').doc(String(nextId + 1)), doc)

                t.update(this.ref, {
                  articleCount: docs.length + 1
                })
              })
          })
      } finally {
        this.loading = false

        this.back()
      }
    },

    async update () {
      try {
        const now = new Date()

        const doc = {
          title: this.form.title,
          updatedAt: now,
          content: this.$refs.editor.invoke('getMarkdown')
        }

        await this.ref.collection('articles').doc(this.articleId).update(doc)
      } finally {
        this.loading = false

        this.back()
      }
    },

    back () {
      this.$router.replace('/board/' + this.document)
    }
  }
}
</script>
