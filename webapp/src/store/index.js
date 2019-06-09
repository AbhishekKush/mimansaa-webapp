import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth'
import snackbar from './modules/snackbar'
import school from './modules/school'
import common from './modules/common'
Vue.use(Vuex);

export const store = new Vuex.Store({
    strict:false,
    modules : {
        auth,
        snackbar,
         common
    }

})