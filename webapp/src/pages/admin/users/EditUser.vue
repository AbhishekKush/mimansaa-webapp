<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap v-if="loaded">
      <v-flex md8>
        <h1 class="display-1 font-weight-light">Edit User</h1>
        <v-card class="pa-4 mt-4">
          <v-form v-model="valid">
            <v-text-field
              v-model="editedUser.name"
              :rules="nameRules"
              label="School Name"
              required
            ></v-text-field>
            <v-textarea
              v-model="editedUser.address"
              :rules="addressRules"
              label="Address"
              hint="Type full adress with area pincode"
            ></v-textarea>
            <v-text-field
              v-model="editedUser.phone"
              :rules="phoneRules"
              label="School phone No."
              required
            ></v-text-field>
            <v-text-field
              v-model="editedUser.email"
              :rules="emailRules"
              label="School Email ID"
              required
            ></v-text-field>
            <!-- <google-map @locationChanged="loctionUpdated"/> -->
            <v-btn color="primary" flat="flat" @click="dialog = true">Change Location</v-btn>
            <v-dialog v-model="dialog" max-width="800px" persistent>
              <v-card class="pa-4">
                <v-card-title class="headline">Use Google's location service?</v-card-title>
                 <v-divider></v-divider>
                <set-map @locationChanged="loctionUpdated"/>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat="flat" @click="dialog = false">Disagree</v-btn>
                  <v-btn color="primary"  @click="saveChangedLocation()">Save Location</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <view-map :center="{lat:editedUser.latitude,lng:editedUser.longitude}"/>
            <input type="hidden" v-model="editedUser.latitude">
            <input type="hidden" v-model="editedUser.longitude">
            <v-btn
              :loading="loading"
              :disabled="loading || !valid"
              color="primary"
              @click="saveeditedUser"
            >
              Update
              <v-icon right dark>save</v-icon>
            </v-btn>
          </v-form>
        </v-card>
      </v-flex>

      <v-flex md4>
        <h1 class="display-1 font-weight-light">Add School</h1>
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
      dialog:false,
      loaded: false,
      loading: false,
      templat:null,
      templng:null,
      editedUser: {
        name: "",
        address: "",
        city: "",
        phone: "",
        email: "",
        latitude: null,
        longitude: null,
      },
      place: null,

      nameRules: [
        v => !!v || "School name is required"
        // v => v.length >= 10 || 'Name must be less than 10 characters'
      ],
      addressRules: [v => !!v || "School address is required"],
      cityRules: [v => !!v || "City is required"],
      phoneRules: [
        v => !!v || "Phone no is required",
        v => v.length == 10 || "Phone no should be 10 digit"
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
    editedUserName: {
      get: function() {
        return this.$store.state.school.loadedSchool.name;
      },
      set: function(value) {
        this.$store.commit("editedUserName", value);
      }
    }
    // editedUser(){
    //   return this.$store.getters.loadedSchool
    // },
    // isLoaded() {
    //   return this.$store.getters.isLoaded;
    // }
  },
  created() {
    this.loadUser(this.uid);
    //this.loaded=false
  },
  methods: {
    loctionUpdated(location) {
      this.templat = location.lat
      this.templng = location.lng
    },
    saveChangedLocation(){
      this.dialog=false
      this.editedUser.latitude = this.templat
      this.editedUser.longitude = this.templng
    },
    saveeditedUser() {
      this.loading = true;
      // this.$store.dispatch('setMainLoading', true)
      firebase
        .database()
        .ref("info_school")
        .child(this.id)
        .update(this.editedUser)
        .then(data => {
          //  this.editedUser=data.val()
          // console.log(data.val())
          // this.$store.dispatch('setMainLoading', false)
          this.$store.dispatch("showSnackbar", {
            snackbar: {
              message: "Updated Successfully",
              type: "success"
            }
          });
        });
      this.loading = false;
    },
    loadUser(uid) {
      this.loaded = false;
      this.$store.dispatch("showSnackbar", {
        snackbar: {
          message: "Loading Data"
        }
      });
      this.$store.dispatch("setMainLoading", true);
      firebase
        .database()
        .ref("all_users/" + uid)
        .once("value")
        .then(data => {
          this.editedUser = data.val();
          // console.log(data.val())
          this.$store.dispatch("setMainLoading", false);
          // console.log(this.loaded )
          this.loaded = true;
          // console.log(this.loaded )
        });
    }
  }
};
</script>
