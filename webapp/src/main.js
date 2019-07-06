// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import axios from 'axios'
import './assets/scss/style.scss'
import {store} from './store'
import router from './router'
import firebase from 'firebase'
import * as VueGoogleMaps from "vue2-google-maps"
import '@/firebase/'
import VuetifyDialog from 'vuetify-dialog'

Vue.use(Vuetify)

Vue.use(VuetifyDialog, {

  confirm: {
    actions: {
      false: 'No',
      true: {
        text: 'Yes',
        color: 'primary'
      }
    },
    icon: false, // to disable icon just put false
    width:250
  },
  warning: {},
  error: {},
  prompt: {}
})

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    libraries: "places" // necessary for places input
  }
})


Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  store.dispatch('checkLogin');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.isAuthenticated) {
      next({
        name: 'LoginPage'
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresVisitor)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (store.getters.isAuthenticated) {
      next({
        name: 'DashboardPage'
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

new Vue({
  store:store,
  el: '#app',
  router,
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        store.dispatch('userSignOut')
        }
     });
    },
  components: { App },
  template: '<App/>'
})
