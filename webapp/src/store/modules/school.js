import firebase from 'firebase';
import router from '@/router';

export default{
    state:{
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: false,
        loading:false,
        error:null
    },
    getters:{
            
    },
    mutations: {
        addSchool(state, payload) {

        },
        editedSchoolName(state, payload) {
            console.log("Payload " + payload)
            state.loadedSchool.name = payload
    },
        setLoadedSchools(state, payload) {
            state.loadedSchools = payload
        }
    },
    actions: {
        addNewSchool({ dispatch,state }, payload) {
            state.loading = true
            dispatch('showSnackbar', {
                snackbar: {
                    message: "Saving Data"
                }
            })
            const ref = firebase.database().ref('info_school')
            ref.push(payload)
                .then((data) => {
                    ref.child(data.key).update({ "id": data.key,"addedOn": firebase.database.ServerValue.TIMESTAMP })
                    dispatch('showSnackbar', {
                        snackbar: {
                            message: "Data saved successfully",
                            type: "success"
                        }
                    })
                    state.loading = false
                })
                .catch((error) => {
                    console.log(error)
                    dispatch('showSnackbar', {
                        snackbar: {
                            message: "Error while saving data",
                            type: "error"
                        }
                    })
                    state.loading = false
                })
        },
        loadSchools({ commit, state }) {
            state.loading = true
            firebase.database().ref('info_school').once('value')
                .then((data) => {
                    const schools = []
                    const obj = data.val()
                    for (let key in obj) {
                        schools.push({
                            id: key,
                            name: obj[key].name,
                            city: obj[key].city,
                            phone: obj[key].phone
                        })
                    }
                    commit('setLoadedSchools', schools)
                    console.log(schools)
                    state.loading = false
                })
        },
        loadSchool({commit}){
            
        }
    }
