<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <site-title :title="site.title"></site-title>
      <v-spacer/>
      <v-btn icon @click="save"><v-icon>mdi-check</v-icon></v-btn>
      <v-btn icon @click="read"><v-icon>mdi-numeric</v-icon></v-btn>
      <v-btn icon @click="readOne"><v-icon>mdi-account-badge-alert</v-icon></v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer">
      <site-menu :items="site.menu"></site-menu>
    </v-navigation-drawer>

    <v-content>
      <router-view/>
    </v-content>

    <site-footer :footer="site.footer"></site-footer>
  </v-app>
</template>

<script>
import SiteTitle from '@/views/site/title'
import SiteFooter from '@/views/site/footer'
import SiteMenu from '@/views/site/menu'

export default {
  name: 'App',
  components: {
    SiteTitle,
    SiteFooter,
    SiteMenu
  },
  data () {
    return {
      drawer: false,
      site: {
        menu: [],
        title: '나의 타이틀입니다.',
        footer: 'footer입니다.'
      }
    }
  },
  // create-> 인스턴스가 작성된 직후, mounted -> el이 새로 생성된 vm.$el로 대체된 인스턴스가 마운트 된 직 후
  created () {
    this.subscribe()
  },
  methods: {
    subscribe () {
      this.$firebase.database().ref().child('site').on('value', (sn) => {
        const v = sn.val()
        if (!v) {
          this.$firebase.database().ref().child('site').set(this.site)
        }
        this.site = v
      }, (e) => {
        console.log(e.message)
      })
    },

    save () {
      console.log('save@@@')
      this.$firebase.database().ref().child('abcd').set({
        title: 'abcd', text: 'tttttaat'
      })
    },

    read () {
      console.log('read!!!!')
      this.$firebase.database().ref().child('abcd').on('value', (sn) => {
        console.log(sn)
        console.log(sn.val())
      })
    },

    async readOne () {
      const sn = await this.$firebase.database().ref().child('abcd').once('value')
      console.log(sn.val())
    }
  }
}
</script>
