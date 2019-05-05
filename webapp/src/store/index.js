import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import router from '@/router';

Vue.use(Vuex);

export const store = new Vuex.Store({
	strict:false,
	state: {
        user: null,
        isAuthenticated: false
    },
	mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        setIsAuthenticated(state, payload) {
            state.isAuthenticated = payload;
        }
    },
    getters: {
        isAuthenticated:state=>{
            return state.isAuthenticated
        }
    },
	actions: {
        userLogin({ commit }, { email, password }) {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(user => {
                    commit('setUser', user);
                    commit('setIsAuthenticated', true);
                    router.push('/admin');
                })
                .catch(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);

                    //remove after testing
                    // commit('setUser', user);
                    // commit('setIsAuthenticated', true);
                    // router.push('/dashboard');
                });
        },
		userJoin({ commit }, { email, password }) {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(user => {
                    commit('setUser', user);
                    commit('setIsAuthenticated', true);
                })
                .catch(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                });
        }
	}

})