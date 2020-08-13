<template>
  <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
  <v-menu offset-y v-else-if="!$store.state.fireBaseUser">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on"><v-icon>mdi-account</v-icon></v-btn>
    </template>

    <v-card>
      <v-card-title>로그인</v-card-title>
      <v-divider/>
      <v-card-actions>
        <v-btn color="red" dark @click="signInWithGoogle" block><v-icon left>mdi-google</v-icon>Google</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn color="blue" dark @click="signInWithFacebook" block><v-icon left>mdi-facebook</v-icon>Facebook</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>

  <v-menu offset-y v-else>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-avatar size="32">
          <v-img :src="$store.state.fireBaseUser.photoURL"></v-img>
        </v-avatar>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>정보</v-card-title>
      <v-card-actions>
        <v-btn dark @click="signOut" block><v-icon left>mdi-exit-to-app</v-icon>로그아웃</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data () {
    return {
      loading: false
    }
  },

  methods: {
    async signInWithGoogle () {
      const provider = new this.$firebase.auth.GoogleAuthProvider()
      this.$firebase.auth().languageCode = 'ko'
      this.loading = true

      try {
        const sn = await this.$firebase.auth().signInWithPopup(provider)
        this.$store.commit('setFireBaseUser', sn.user)
      } finally {
        this.loading = false
      }
    },

    signInWithFacebook () {
      throw Error('미구현')
    },

    signOut () {
      this.$firebase.auth().signOut()
    }
  }
}
</script>
