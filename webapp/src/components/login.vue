<template>
  <!-- <v-app id="inspire"> -->
    <!-- <v-content> -->

    <v-container fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Login</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field prepend-icon="person" name="email" label="Email" type="email"
                                          v-model="email" :rules="emailRules" required>
                            </v-text-field>
                            <v-text-field prepend-icon="lock" name="password" label="Password" id="password"
                                          type="password" required v-model="password" :rules="passwordRules">
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <router-link to="/auth/register" ><v-btn color=""  >Register</v-btn></router-link>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" :disabled="!valid" @click="submit">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
    <!-- </v-content> -->   
  <!-- </v-app> -->
</template>

<script>
// import firebase from 'firebase';
export default {
    name: 'Signin',
    data() {
        return {
            valid: false,
            email: '',
            snackbar:null,
            password: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v =>
                    v.length >= 6 ||
                    'Password must be greater than 6 characters'
            ]
        };
    },
     watch: {
    // user (auth) {
    //   if(!!auth){
    //     this.$router.replace(this.nextRoute)
    //   }
    // }
  },
  computed:{
      user(){
        //   return this.$store.getters.getUser
      }
  },
    mounted(){
    },
    methods: {
        submit() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('userLogin', {
                    email: this.email,
                    password: this.password
                });

                this.$store.dispatch('showSnackbar', {
                    snackbar:{
                        message:"Logging In"
                    }
                });
            }
        }
    }
};
</script>
