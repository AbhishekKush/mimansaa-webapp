<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap v-if="loaded">
      <v-flex md8>
        <h1 class="display-1 font-weight-light">Edit User</h1>
        <v-card class="pa-4 mt-4">
          <v-form v-model="valid" ref="form">
            <v-layout row wrap>
              <v-flex xs4>
                <v-select
                  v-model="editedUser.user_type"
                  :items="['webadmin','transporter','driver','parent','guard']"
                  label="Role"
                  required
                  outline
                  color="primary"
                ></v-select>
              </v-flex>
              <v-flex sm4></v-flex>
              <v-flex sm2 class="pt-4">
                <span
                  class="title"
                  :class="editedUser.status_active?'success--text':'error--text'"
                >{{ editedUser.status_active?"Active":"Inactive" }}</span>
              </v-flex>

              <v-flex sm2>
                <v-switch
                  v-model="editedUser.status_active"
                  false-value="Inactive"
                  color="success"
                  style="float:right;"
                  hide-details
                ></v-switch>
              </v-flex>
              <v-flex sm12 xs12>
                <v-text-field v-model="editedUser.name" :rules="nameRules" label="Name" required></v-text-field>
              </v-flex>
              <v-flex sm12 xs12>
                <v-textarea
                  v-model="editedUser.address"
                  :rules="addressRules"
                  label="Address"
                  hint="Type full adress with area pincode"
                ></v-textarea>
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="editedUser.phone"
                  :rules="phoneRules"
                  persistent-hint
                  hint="+91 with your mobile no"
                  label="Phone No."
                  required
                ></v-text-field>
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="editedUser.email"
                  :rules="emailRules"
                  label="Email ID"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <!-- <google-map @locationChanged="loctionUpdated"/> -->
                <v-btn color="primary" flat="flat" @click="dialog = true">Change Location</v-btn>
                <v-dialog v-model="dialog" max-width="800px" persistent>
                  <v-card class="pa-4">
                    <v-card-title class="headline">Use Google's location service?</v-card-title>
                    <v-divider></v-divider>
                    <set-map @locationChanged="loctionUpdated" />
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" flat="flat" @click="dialog = false">Disagree</v-btn>
                      <v-btn color="primary" @click="saveChangedLocation()">Save Location</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <view-map :center="{lat:editedUser.home_latitude,lng:editedUser.home_longitude}" />
              </v-flex>
              <v-flex sm12>
                <v-btn
                  :loading="loading"
                  :disabled="loading || !valid"
                  color="primary"
                  @click="saveEditedUser"
                >
                  Update
                  <v-icon right dark>save</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card>
      </v-flex>

      <v-flex md4>
        <h1 class="display-1 font-weight-light">Change Password</h1>
        <v-layout row wrap>
          <v-flex sm12>
            <v-card class="pa-4 mt-4">
              <v-form v-model="validPasswordForm">
                <v-text-field
                  label="Password*"
                  v-model="password"
                  :rules="[v => v.length >= 6 || 'Password must have atleast 6 character long.']"
                  :type="pVisibility ? 'text' : 'password'"
                  :append-icon="pVisibility ? 'visibility' : 'visibility_off'"
                  required
                  @click:append="pVisibility = !pVisibility;"
                ></v-text-field>

                <v-btn color="primary" flat @click="generatePassword()">
                  <v-icon dark>autorenew</v-icon>
                </v-btn>

                <v-btn :disabled="!validPasswordForm" color="primary" @click="changePassword">
                  SAVE
                  <v-icon right dark>save</v-icon>
                </v-btn>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <div id="map"></div>
    </v-layout>
  </v-container>
</template>

<script>
import setMap from "@/components/setMap";
import viewMap from "@/components/viewMap";
import firebase from "firebase";

export default {
  name: "App",
  components: {
    setMap,
    viewMap
  },

  props: ["uid"],
  data() {
    return {
      valid: false,
      validPasswordForm: false,
      dialog: false,
      loaded: false,
      loading: false,
      templat: null,
      templng: null,
      pVisibility: "",
      password: "",
      editedUser: {
        name: "",
        address: "",
        phone: "",
		email: "",
		uid:"",
        home_latitude: "0",
        home_longitude: "0",
        user_type: "",
        status_active: false
      },
      place: null,

      nameRules: [
        v => !!v || "Name is required"
        // v => v.length >= 10 || 'Name must be less than 10 characters'
      ],
      addressRules: [v => !!v || "Address is required"],
      phoneRules: [
        v => !!v || "Phone no is required",
        v => v.length == 13 || "+91 Enter valid phone no. "
      ],
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ]
    };
  },
  computed: {
    // isLoaded() {
    //   return this.$store.getters.isLoaded;
    // }
  },
  mounted() {
  },
  created() {
    this.loadUser(this.uid);
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },

    async confirm() {
      let res = await this.$dialog.confirm({
        text: "Do you really want to exit?",
        title: "Warning",
        persistent: true
      });
      if (res === undefined) {
        this.$dialog.notify.warning("Closed without select action");
      } else {
        this.$dialog.notify.info(`Your choice is ${res}`);
      }
    },

    loctionUpdated(location) {
      this.templat = location.lat;
      this.templng = location.lng;
    },
    saveChangedLocation() {
      this.dialog = false;
      this.editedUser.home_latitude = this.templat;
      this.editedUser.home_longitude = this.templng;
    },
    async saveEditedUser() {

		if(!this.$refs.form.validate) return false
      let res = await this.$dialog.confirm({
        text: "Do you really want to save ?",
        title: "Save",
        persistent: true
      });

      if (res === true) {
        this.loading = true;
        // this.$store.dispatch('setMainLoading', true)

        var updateWUser = firebase.functions().httpsCallable("updateWUser");
        updateWUser(this.editedUser)
          .then(result => {
            console.log("Authentication Details  Updated"+result);
            firebase
              .database()
              .ref("all_users")
              .child(this.uid)
              .update(this.editedUser)
              .then(data => {
                //  this.editedUser=data.val()
                console.log("DB VALUE: "+data)
                // this.$store.dispatch('setMainLoading', false)
                this.$store.dispatch("showSnackbar", {
                  snackbar: {
                    message: "Updated Successfully",
                    type: "success"
                  }
                });
              });
          })
          .catch(error => {
            this.$store.dispatch("showSnackbar", {
              snackbar: {
                message: error.message,
                type: "error"
              }
            });
          });

        this.loading = false;
      }
    },
    loadUser(uid) {

      this.loaded = false
      this.$store.dispatch("showSnackbar", {
        snackbar: {
          message: "Loading Data"
        }
      })
      this.$store.dispatch("setMainLoading", true)
      firebase
        .database()
        .ref("all_users/" + uid)
        .once("value")
        .then(result => {
          // this.editedUser = data.val();
          var data = result.val();
          this.editedUser.address = data.address;
          this.editedUser.email = data.email;
          this.editedUser.home_latitude = data.home_latitude;
          this.editedUser.home_longitude = data.home_longitude;
          this.editedUser.name = data.name;
		  this.editedUser.phone = data.phone;
		  this.editedUser.uid=data.uid;
          this.editedUser.status_active = data.status_active;
          this.editedUser.user_type = data.user_type;
          // console.log(data.val())
          this.$store.dispatch("setMainLoading", false);
		  this.loaded = true;
		   setTimeout(() => this.validateMyForm(), 2000)
        });
    },
    async changePassword() {
      let res = await this.$dialog.confirm({
        text: "Do you really want to change your password ?",
        title: "Confirm",
        persistent: true
      });
      if (res === true) {
        console.log("Changing Password " + this.uid);
        var changeWPassowrd = firebase
          .functions()
          .httpsCallable("changeWPassword");
        changeWPassowrd({ uid: this.uid, password: this.password })
          .then(result => {
            this.$store.dispatch("showSnackbar", {
              snackbar: {
                message: "Password changed successfylly",
                type: "success"
              }
            });
          })
          .catch(error => {
            this.$store.dispatch("showSnackbar", {
              snackbar: {
                message: error.message,
                type: "error"
              }
            });
          });
      }
	},
	validateMyForm(){
		this.$refs.form.validate()
	},
    generatePassword() {
      var length = 8;
      var chars =
        "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
      var pass = "";
      for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
      }
      this.password = pass;
	}
  }
};
</script>
