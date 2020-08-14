<template>
  <v-container fluid>
    <v-card :loading="loading">
      <v-toolbar color="accent" dense flat dark>
        <v-toolbar-title>게시판 글 작성</v-toolbar-title>

        <v-spacer/>

        <v-btn icon @click="read"><v-icon>mdi-allergy</v-icon></v-btn>
        <v-btn icon @click="back"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <v-btn icon @click="save"><v-icon>mdi-content-save</v-icon></v-btn>
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

    back () {
      this.$router.go(-1)
    },

    async save () {
      this.loading = true

      try {
        const now = new Date()
        const id = await this.getNextId()
        const md = this.$refs.editor.invoke('getMarkdown')
        const sn = await this.$firebase.storage()
          .ref()
          .child('boards')
          .child(this.document)
          .child(id + '.md').putString(md)
        const contentUrl = await sn.ref.getDownloadURL()
        const doc = {
          title: this.form.title,
          updateAt: now,
          contentUrl: contentUrl
        }
        console.log(contentUrl)

        const batch = await this.$firebase.firestore().batch()

        if (!this.articleId) {
          doc.createdAt = now
          doc.commentCount = 0
          batch.set(this.ref.collection('articles').doc(id), doc)
          batch.update(this.ref, { count: this.$firebase.firestore().FieldValue.increment(1) })
        } else {
          batch.update(this.ref.collection('articles').doc(this.articleId), doc)
        }

        await batch.commit()
      } finally {
        this.loading = false
      }
    },

    async getNextId () {
      const articles = await this.$firebase.firestore()
        .collection('boards')
        .doc(this.document)
        .collection('articles')
        .get()

      const articleArr = []
      articles.forEach(article => {
        if (article.exists) {
          articleArr.push(article.id)
        }
      })

      return Math.max(...articleArr)
    }
  }
}
</script>
