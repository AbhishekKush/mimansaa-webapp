import firebase from 'firebase';
import router from '@/router';

export default {
    state: {
        loading: true,
        loaded: false,
        error: null,
        loadedSchools: [
           
        ]


    },
    getters: {
        loadedSchools(state) {
            return state.loadedSchools
        },
        loadedSchool(state) {
            return state.loadedSchool
        },
        loadingStatus(state) {
            return state.loading
        },
        isLoaded(state) {
            return state.loaded
        },


    },
    mutations: {
        addSchool(state, payload) {

        },
        editedSchoolName(state, payload) {
            state.loadedSchool.name = payload
        },
        setLoadedSchools(state, payload) {
            state.loadedSchools = payload
        },
        setLoadedSchool(state, payload) {
            state.loaded = false
            state.loadedSchool = payload
            state.loaded = true
        },
        setLoading(state, payload) {
            state.loading = payload
        },
        setLoaded(state, payload) {
            state.loaded = payload
        }
    },
    actions: {
        // addNewSchool({ dispatch, state }, payload) {
        //     state.loading = true
        //     dispatch('showSnackbar', {
        //         snackbar: {
        //             message: "Saving Data"
        //         }
        //     })
        //     const ref = firebase.database().ref('info_school')
        //     ref.push(payload)
        //         .then((data) => {
        //             ref.child(data.key).update({ "id": data.key, "addedOn": firebase.database.ServerValue.TIMESTAMP })
        //             dispatch('showSnackbar', {
        //                 snackbar: {
        //                     message: "Data saved successfully",
        //                     type: "success"
        //                 }
        //             })
        //             state.loading = false
        //         })
        //         .catch((error) => {
        //             console.log(error)
        //             dispatch('showSnackbar', {
        //                 snackbar: {
        //                     message: "Error while saving data",
        //                     type: "error"
        //                 }
        //             })
        //             state.loading = false
        //         })
        // },
        // loadSchools({ commit, state }) {
        //     state.loading = true
        //     firebase.database().ref('info_school').once('value')
        //         .then((data) => {
        //             const schools = []
        //             const obj = data.val()
        //             for (let key in obj) {
        //                 schools.push({
        //                     id: key,
        //                     name: obj[key].name,
        //                     city: obj[key].city,
        //                     phone: obj[key].phone
        //                 })
        //             }
        //             commit('setLoadedSchools', schools)
        //             // console.log(schools)
        //             state.loading = false
        //         })
        // },
        // loadSchool({ dispatch, commit, state }, id) {
        //     dispatch('showSnackbar', {
        //         snackbar: {
        //             message: "Loading Data"
        //         }
        //     })
        //     commit('setLoading', true)
        //     firebase.database().ref('info_school/' + id).once('value')
        //         .then((data) => {
        //             commit('setLoadedSchool', data.val())
        //             // console.log(data.val())
        //             commit('setLoading', false)
        //         })
        // }
    }
}