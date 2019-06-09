<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap v-if="loaded">
      <v-flex md8>
        <h1 class="display-1 font-weight-light">Edit School</h1>
        <v-card class="pa-4 mt-4">
          <v-form v-model="valid">
            <v-text-field
              v-model="editedSchool.name"
              :rules="nameRules"
              label="School Name"
              required
            ></v-text-field>
            <v-textarea
              v-model="editedSchool.address"
              :rules="addressRules"
              label="Address"
              hint="Type full adress with area pincode"
            ></v-textarea>
            <v-text-field v-model="editedSchool.city" :rules="cityRules" label="City" required></v-text-field>
            <v-text-field
              v-model="editedSchool.phone"
              :rules="phoneRules"
              label="School phone No."
              required
            ></v-text-field>
            <v-text-field
              v-model="editedSchool.email"
              :rules="emailRules"
              label="School Email ID"
              required
            ></v-text-field>
            <h3>School Timing</h3>
            <v-layout row align-center justify-center fill-height mt-4 wrap>
              <v-flex md3>
                <label>From:</label>
              </v-flex>
              <v-flex md3>
                <v-select
                  :rules="fromHourRules"
                  v-model="editedSchool.openHour"
                  v-bind:items="hours"
                  label="Hour"
                  solo
                ></v-select>
              </v-flex>
              <v-flex md3>
                <v-select
                  :rules="fromMinuteRules"
                  v-model="editedSchool.openMinute"
                  v-bind:items="minutes"
                  label="Minute"
                  solo
                ></v-select>
              </v-flex>
              <v-flex md3>
                <v-select
                  :rules="fromAmPmRules"
                  v-model="editedSchool.openAmPm"
                  v-bind:items="['AM','PM']"
                  label="AM/PM"
                  solo
                ></v-select>
              </v-flex>
              <v-flex md3>
                <label>To:</label>
              </v-flex>
              <v-flex md3>
                <v-select
                  v-bind:items="hours"
                  v-model="editedSchool.closeHour"
                  :rules="toHourRules"
                  label="Hour"
                  solo
                ></v-select>
              </v-flex>
              <v-flex md3>
                <v-select
                  v-bind:items="minutes"
                  v-model="editedSchool.closeMinute"
                  :rules="toMinuteRules"
                  label="Minute"
                  solo
                ></v-select>
              </v-flex>
              <v-flex md3>
                <v-select
                  :rules="toAmPmRules"
                  v-model="editedSchool.closeAmPm"
                  v-bind:items="['AM','PM']"
                  label="AM/PM"
                  solo
                ></v-select>
              </v-flex>
            </v-layout>
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
            <view-map :center="{lat:editedSchool.latitude,lng:editedSchool.longitude}"/>
            <input type="hidden" v-model="editedSchool.latitude">
            <input type="hidden" v-model="editedSchool.longitude">
            <v-btn
              :loading="loading"
              :disabled="loading || !valid"
              color="primary"
              @click="saveEditedSchool"
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
  props: ["id"],
  data() {
    return {
      valid: false,
      dialog:false,
      loaded: false,
      loading: false,
      templat:null,
      templng:null,
      editedSchool: {
        name: "",
        address: "",
        city: "",
        phone: "",
        email: "",
        latitude: null,
        longitude: null,
        openHour: null,
        openMinute: null,
        openAmPm: null,
        closeHour: null,
        closeMinute: null,
        closeAmPm: null
      },
      place: null,
      hours: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12"
      ],
      minutes: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59"
      ],
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
      ],
      fromHourRules: [v => !!v || "Hour is required"],
      fromMinuteRules: [v => !!v || "Minute is required"],
      fromAmPmRules: [v => !!v || "AM/PM is required"],
      toHourRules: [v => !!v || "Hour is required"],
      toMinuteRules: [v => !!v || "Minute is required"],
      toAmPmRules: [v => !!v || "AM/PM is required"]
    };
  },
  computed: {
    editedSchoolName: {
      get: function() {
        return this.$store.state.school.loadedSchool.name;
      },
      set: function(value) {
        this.$store.commit("editedSchoolName", value);
      }
    }
    // editedSchool(){
    //   return this.$store.getters.loadedSchool
    // },
    // isLoaded() {
    //   return this.$store.getters.isLoaded;
    // }
  },
  created() {
    this.loadSchool(this.id);
    //this.loaded=false
  },
  methods: {
    loctionUpdated(location) {
      this.templat = location.lat
      this.templng = location.lng
    },
    saveChangedLocation(){
      this.dialog=false
      this.editedSchool.latitude = this.templat
      this.editedSchool.longitude = this.templng
    },
    saveEditedSchool() {
      this.loading = true;
      // this.$store.dispatch('setMainLoading', true)
      firebase
        .database()
        .ref("info_school")
        .child(this.id)
        .update(this.editedSchool)
        .then(data => {
          //  this.editedSchool=data.val()
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
    loadSchool(id) {
      this.loaded = false;
      this.$store.dispatch("showSnackbar", {
        snackbar: {
          message: "Loading Data"
        }
      });
      this.$store.dispatch("setMainLoading", true);
      firebase
        .database()
        .ref("info_school/" + id)
        .once("value")
        .then(data => {
          this.editedSchool = data.val();
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
