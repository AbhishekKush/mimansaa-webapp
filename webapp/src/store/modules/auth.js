import firebase from 'firebase';
import router from '@/router';
export default{
    state:{
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: false,
        
    },
    getters: {
        isAuthenticated:state=>{
            return state.isAuthenticated
        },
        getUser:state=>{
            return state.user
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