<template>
 <v-app light>
    <v-toolbar class="white">
      <v-toolbar-title >Mimansaa</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <section>
    <v-parallax
    dark
    src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
  >
    <v-layout
      align-center
      column
      justify-center
    >
      <h1 class="display-2 font-weight-thin mb-3">404 Not Found!</h1>
      <h4 class="subheading">Goto home page</h4>
      <router-link to="/" ><v-btn color=""  >Home</v-btn></router-link>
    </v-layout>
  </v-parallax>
      </section>

      <v-footer class="blue darken-2">
        <v-layout row wrap align-center>
          <v-flex xs12>
            <div class="white--text ml-3">
              Made with
              <v-icon class="red--text">favorite</v-icon>
              by <a class="white--text" href="https://vuetifyjs.com" target="_blank">Vuetify</a>
              and <a class="white--text" href="https://github.com/vwxyzjn">Costa Huang</a>
            </div>
          </v-flex>
        </v-layout>
      </v-footer>
    </v-content>
  </v-app>
</template>

<script>
import UserRegister from '@/components/register'
import UserLogin from '@/components/login'
export default {
    name: 'Signin',
    components:{
        'UserRegister':UserRegister,
        'UserLogin':UserLogin
    },
    data() {
        return {
            valid: false,
            showLogin:true
        };
    },
    methods: {
        submit() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('userLogin', {
                    email: this.email,
                    password: this.password
                });
            }
        }
    }
};
</script>
