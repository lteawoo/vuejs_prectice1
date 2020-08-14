export default {
  install (Vue) {
    Vue.prototype.$notifier = {
      showMessage: ({ content = '', color = '' }, store) => {
        store.commit('snackbar/showMessage', { content, color })
      }
    }
  }
}
