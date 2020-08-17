import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import en from 'vuetify/es5/locale/en'
import ko from 'vuetify/es5/locale/ko'
import Notifier from './notifier'

Vue.use(Vuetify)
Vue.use(Notifier)

export default new Vuetify({
  lang: {
    locales: { en, ko },
    current: 'ko'
  }
})
