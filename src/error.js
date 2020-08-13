import Vue from 'vue'
import store from './store'

Vue.config.errorHandler = e => {
  console.error(e.message)
  Vue.prototype.$notifier.showMessage({
    content: e.message,
    color: 'error'
  }, store)
}
