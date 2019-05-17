import firebase from 'firebase';
import router from '@/router';
// const  fb  = require( '@/firebase/');
export default{
    state:{
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: false,
        loading:false,
        error:null
    },
    getters: {
        isAuthenticated:state=>{
            return state.isAuthenticated
        },
        getUser:state=>{
            return state.user
        },
        getAllUser({ state, commit }) {
            return firebase.database().ref('all_users')
                
        }
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
            localStorage.setItem('user',JSON.stringify(payload))
        },
        setIsAuthenticated(state, payload) {
            state.isAuthenticated = payload;
        },
        setLoading(state,payload){
            state.loading=payload
        },
        setError(state,payload){
            state.error=payload
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
        },
        checkLogin({ commit,state }){
            if(state.user){
                commit('setIsAuthenticated', true)
            }
            else{
                commit('setIsAuthenticated', false)
            }
        },
        userSignOut({ commit }){
            firebase.auth()
              .signOut()
              .then(() => {
                localStorage.removeItem('user')
                commit('setUser', null);
                commit('setIsAuthenticated', false)
                router.push('/');
              });
          }
    }
}