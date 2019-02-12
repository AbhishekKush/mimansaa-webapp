// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import axios from 'axios'
import './assets/scss/style.scss'
import {store} from './store'
Vue.use(Vuetify)
import router from './router'


Vue.config.productionTip = false

new Vue({
  store:store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
