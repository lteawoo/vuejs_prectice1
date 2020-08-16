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
      <site-sign></site-sign>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" width="400">
      <site-menu :menus="site.menu"></site-menu>
    </v-navigation-drawer>

    <v-main>
      <router-view/>
    </v-main>

    <site-footer :footer="site.footer"></site-footer>
    <snackbar></snackbar>
  </v-app>
</template>

<script>
import SiteTitle from '@/views/site/title'
import SiteFooter from '@/views/site/footer'
import SiteMenu from '@/views/site/menu'
import SiteSign from '@/views/site/sign'
import Snackbar from './components/Snackbar.vue'

export default {
  name: 'App',
  components: {
    SiteTitle,
    SiteFooter,
    SiteMenu,
    SiteSign,
    Snackbar
  },
  data () {
    return {
      drawer: false,
      isShow: false,
      site: {
        menu: [
          {
            title: 'home',
            icon: 'mdi-home',
            subMenus: [
              {
                title: 'DashBoard',
                to: '/'
              },
              {
                title: 'About',
                to: '/about'
              }
            ]
          },
          {
            title: 'about',
            active: true,
            icon: 'mdi-account',
            subMenus: [
              {
                title: 'xxx',
                to: '/xxx'
              }
            ]
          }
        ],
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
          return
        }

        this.site = v
      }, (e) => {
        console.log(e.message)
      })
    },

    showSnackbar () {
      this.$notifier.showMessage({
        content: 'Hello, snackbar',
        color: 'info'
      }, this.$store)
    }
  }
}
</script>
