export default {
  install (Vue) {
    Vue.prototype.$notifier = {
      showMessage: ({ content = '', color = '' }, store) => {
        console.log(content + ', ' + color)
        console.log(store)
        store.commit('snackbar/showMessage', { content, color })
      }
    }
  }
}
