<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <v-content> <!-- Main Content Area -->
      <v-container fluid fill-height >
      <v-slide-x-reverse-transition mode="out-in">
        <router-view/>>
      </v-slide-x-reverse-transition>
      </v-container>
    </v-content> <!-- /Main Content Area -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

