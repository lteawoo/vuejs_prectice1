<template>
  <v-container fluid v-if="user">
    <v-card :loading="loading">
      <v-toolbar color="accent" dense flat dark>
        <v-toolbar-title>게시판 글 작성</v-toolbar-title>

        <v-spacer/>
        <v-btn icon @click="back"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <template v-if="user">
          <v-btn icon @click="write" v-if="!articleId" :hidden="!user" :disabled="!user"><v-icon>mdi-content-save</v-icon></v-btn>
          <v-btn icon @click="update" v-else-if="user.id === this.form.uid"><v-icon>mdi-file-document-edit</v-icon></v-btn>
        </template>
      </v-toolbar>
      <v-card-text>
        <v-text-field v-model="form.title" outlined label="제목"></v-text-field>
        <editor
          ref="editor"
          initialEditType="wysiwyg"
          :options="{
            hideModeSwitch: true
          }"></editor>
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
        content: '',
        uid: '',
        writer: ''
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
        this.form.uid = data.user.uid
        this.form.writer = data.user.displayName
        this.$refs.editor.invoke('setMarkdown', data.content)
      }
    },

    async write () {
      this.loading = true

      try {
        await this.$firebase.firestore()
          .runTransaction(t => t.get(this.ref)
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
              const nextId = articles.empty ? 0 : Math.max(...docs.map(article => article.id))

              t.set(this.ref.collection('articles').doc(String(nextId + 1)), doc)

              t.update(this.ref, {
                articleCount: docs.length + 1
              })
            }))
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
