export default {

    state: {
        loading:false,
        drawer:true,
    },
    getters: {
        loading: state => {
            return state.loading
        },
        drawer: state => {
            return state.drawer
        }
    },
    mutations: {
        setLoading(state, payload) {
            state.loading= payload
        }
    },
    actions: {
        setMainLoading({ commit }, payload) {
            commit('setLoading', payload);
        },
        toggleDrawer({ commit, state},payload){
            state.drawer = !payload
        }

    }
}