<template>
  <div id="app">
      <v-app id="inspire" >
    <!-- <img src="./assets/logo.png"> -->
    <!-- <v-content> 
      <v-container fluid  >  -->
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.type">
      {{ snackbar.message }}
  </v-snackbar>

      <v-slide-x-reverse-transition mode="out-in">
        <router-view/>
      </v-slide-x-reverse-transition>
      <!-- </v-container>
    </v-content> -->
      </v-app>
  </div>
</template>

<script>
export default {

  name: 'App',
   data () {
    return {
    }
   },
   mounted(){
    },
   computed:{
     snackbar(){
       return this.$store.getters.snackbar
     }
   },
   watch: {
        $route(to, from) {
            document.title = to.meta.title || 'Some Default Title';
        },
    }
}
</script>

