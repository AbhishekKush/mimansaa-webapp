export default {
    state: {
        snackbar: {
            show: false,
            message: '',
            timeout: 3000,
            type: ''
        }
    },
    mutations: {
        setSnackbar(state, payload) {
            state.snackbar.show = true,
                state.snackbar.message = payload.message,
                state.snackbar.timeout = payload.timeout || 3000,
                state.snackbar.type = payload.type || ''
        }
    },
    getters: {
        snackbar: state => {
            return state.snackbar
        }
    },
    actions: {
        showSnackbar({ commit }, { snackbar }) {
            commit('setSnackbar', snackbar);
        }

    }
}