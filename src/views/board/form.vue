<template>
  <v-container fluid>
    <v-card :loading="loading">
      <v-toolbar color="accent" dense flat dark>
        <v-toolbar-title>게시판 정보 작성</v-toolbar-title>

        <v-spacer/>

        <v-btn icon @click="back"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <v-btn icon @click="save"><v-icon>mdi-content-save</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field v-model="form.category" outlined label="카테고리"></v-text-field>
        <v-text-field v-model="form.name" outlined label="이름"></v-text-field>
        <v-textarea v-model="form.description" outlined label="설명"></v-textarea>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ['document', 'action'],
  data () {
    return {
      unsubscribe: null,
      form: {
        category: '',
        name: '',
        description: ''
      },
      loading: false,
      exists: false,
      ref: null
    }
  },

  watch: {
    document () {
      this.subscribe()
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

      this.ref = this.$firebase.firestore().collection('boards').doc(this.document)
      this.unsubscribe = this.ref.onSnapshot(doc => {
        this.exists = doc.exists

        if (this.exists) {
          const item = doc.data()
          this.form.category = item.category
          this.form.name = item.name
          this.form.description = item.description
        }
      })
    },

    back () {
      this.$router.go(-1)
    },

    async save () {
      this.loading = true

      const form = {
        category: this.form.category,
        name: this.form.name,
        description: this.form.description,
        updatedAt: new Date()
      }

      try {
        if (!this.exists) {
          form.createdAt = new Date()
          form.articleCount = 0

          await this.ref.set(form)
        } else {
          this.ref.update(form)
        }

        this.$router.push('/board/' + this.document)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
