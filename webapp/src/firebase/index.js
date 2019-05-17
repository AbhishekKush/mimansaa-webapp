import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCQ7tln2RES1bgQZvlD6k2DZU1S2mvMlvk",
    authDomain: "mimansaa-service-api.firebaseapp.com",
    databaseURL: "https://mimansaa-service-api.firebaseio.com",
    projectId: "mimansaa-service-api",
    storageBucket: "mimansaa-service-api.appspot.com",
    messagingSenderId: "143764224870"
  };
  firebase.initializeApp(config);
  //  export const fb =  db.database()

  // https://medium.freecodecamp.org/how-to-build-a-spa-using-vue-js-vuex-vuetify-and-firebase-adding-authentication-with-firebase-d9932d1e4365

//   methods: {
//     orderRecipe(item) {
//         if (this.isAuthenticated) {
//             this.$store.dispatch('addRecipe', item);
//         } else {
//             this.$router.push('/sign-in');
//         }
//     }
// }