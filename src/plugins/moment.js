import Vue from 'vue'
import moment from 'moment'
import dateFormat from 'dateformat'

moment.locale('ko')

Vue.prototype.$moment = moment
Vue.prototype.$dateFormat = dateFormat
