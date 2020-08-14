<template>
  <v-container fluid>
    <v-card :loading="loading">
      <v-toolbar color="accent" dense flat dark>
        <v-toolbar-title>게시판 글 작성</v-toolbar-title>

        <v-spacer/>

        <v-btn icon @click="read"><v-icon>mdi-allergy</v-icon></v-btn>
        <v-btn icon @click="back"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <v-btn icon @click="write"><v-icon>mdi-content-save</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field v-model="form.title" outlined label="제목"></v-text-field>
        <editor :initialValue="form.content" ref="editor"></editor>
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
      }
    },

    async write () {
      this.loading = true

      try {
        const now = new Date()
        const doc = {
          title: this.form.title,
          updateAt: now,
          content: this.$refs.editor.invoke('getMarkdown')
        }
        await this.$firebase.firestore()
          .runTransaction(t => {
            return t.get(this.ref)
              .then(board => {
                if (board.exists) {
                  const articleCount = board.data().articleCount + 1

                  t.update(this.ref, {
                    articleCount: articleCount
                  })

                  t.set(this.ref.collection('articles').doc(String(articleCount)), doc)
                }
              })
          })
      } finally {
        this.loading = false
      }
    },

    back () {
      this.$router.go(-1)
    }
  }
}
</script>
