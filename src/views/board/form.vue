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

  computed: {
    user () {
      return this.$store.state.user
    }
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

    async save () {
      this.loading = true

      if (!this.$store.state.fireBaseUser) throw Error('로그인이 필요합니다')

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
          form.user = {
            uid: this.$store.state.fireBaseUser.uid,
            email: this.user.email,
            photoURL: this.user.photoURL,
            displayName: this.user.displayName
          }

          await this.ref.set(form)
        } else {
          await this.ref.update(form)
        }

        this.back()
      } finally {
        this.loading = false
      }
    },

    back () {
      this.$router.replace('/board/' + this.document)
    }
  }
}
</script>
