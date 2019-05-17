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
    mutations:{

    },
    actions:{

    }
}