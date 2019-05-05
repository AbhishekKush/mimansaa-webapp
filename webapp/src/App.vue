<template>
  <div id="app">
      <v-app id="inspire">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <v-content> 
      <v-container fluid  >  -->
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" >
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
      snackbar:{
        show: true,
        message: 'Hey Abhishek',
        timeout: 3000,
        color: 'success'
      }
    }
   }
}
</script>

