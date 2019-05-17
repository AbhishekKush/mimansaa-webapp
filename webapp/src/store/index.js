import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth'
import snackbar from './modules/snackbar'
Vue.use(Vuex);

export const store = new Vuex.Store({
    strict:false,
    modules : {
        auth,
        snackbar
    }

})