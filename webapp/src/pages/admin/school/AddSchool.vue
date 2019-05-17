<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex md8>
        <h1 class="display-1 font-weight-light">Add New School</h1>
        <v-card class="pa-4 mt-4">
          <v-form v-model="valid">
            <v-text-field v-model="school.name" :rules="nameRules" label="School Name" required></v-text-field>
            <v-textarea
              v-model="school.address"
              :rules="addressRules"
              name="input-7-1"
              label="Address"
              hint="Type full adress with area pincode"
            ></v-textarea>
            <v-text-field v-model="school.city" :rules="cityRules" label="City" required></v-text-field>
            <v-text-field
              v-model="school.mobileNo"
              :rules="mobileRules"
              label="School Mobile No."
              required
            ></v-text-field>
            <v-text-field
              v-model="school.email"
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
                <v-select :rules="fromHourRules" v-model="school.timing.open.hour" v-bind:items="hours" label="Hour" solo></v-select>
              </v-flex>
              <v-flex md3>
                <v-select :rules="fromMinuteRules" v-model="school.timing.open.minute" v-bind:items="minutes" label="Minute" solo></v-select>
              </v-flex>
              <v-flex md3>
                <v-select :rules="fromAmPmRules" v-model="school.timing.open.ampm" v-bind:items="['AM','PM']" label="AM/PM" solo></v-select>
              </v-flex>
              <v-flex md3>
                <label>To:</label>
              </v-flex>
              <v-flex md3>
                <v-select v-bind:items="hours" v-model="school.timing.close.hour" :rules="toHourRules" label="Hour" solo></v-select>
              </v-flex>
              <v-flex md3>
                <v-select v-bind:items="minutes" v-model="school.timing.close.minute" :rules="toMinuteRules" label="Minute" solo></v-select>
              </v-flex>
              <v-flex md3>
                <v-select :rules="toAmPmRules" v-model="school.timing.close.ampm" v-bind:items="['AM','PM']" label="AM/PM" solo></v-select>
              </v-flex>
            </v-layout>
            <google-map @locationChanged="loctionUpdated"/>
            <input type="hidden"  v-model="school.location.lat" >
            <input type="hidden"  v-model="school.location.lng">
            <v-btn :loading="loading" :disabled="loading || !valid"  color="primary" @click="saveData">
              Add School
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
import GoogleMap from "@/components/GoogleMap";

export default {
  name: "App",
  components: {
    GoogleMap
  },
  data() {
    return {
      school: {
        name: "",
        address: "",
        city: "",
        mobileNo:"",
        email:"",
        location: {
            lat:null,
            lng:null
        },
        timing: {
          open: {
            hour: null,
            minute: null,
            ampm: null
          },
          close: {
            hour: null,
            minute: null,
            ampm: null
          }
        }
      },
      valid: false,
      loader: null,
      loading: false,
      place: null,
      hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      minutes: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60
      ],
      nameRules: [
        v => !!v || "School name is required"
        // v => v.length >= 10 || 'Name must be less than 10 characters'
      ],
      addressRules:[
          v => !!v || "School address is required"
      ],
      cityRules:[
          v => !!v || "City is required"
      ],
      mobileRules:[
          v => !!v || "Mobile no is required",
          v => v.length == 10 || 'Mobile no should be 10 digit'
      ],
      emailRules:[
          v => !!v || "E-mail is required",
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      fromHourRules:[
          v => !!v || "Hour is required",
      ],
      fromMinuteRules:[
          v => !!v || "Minute is required",
      ],
      fromAmPmRules:[
          v => !!v || "AM/PM is required",
      ],
      toHourRules:[
          v => !!v || "Hour is required",
      ],
      toMinuteRules:[
          v => !!v || "Minute is required",
      ],
        toAmPmRules:[
          v => !!v || "AM/PM is required",
      ],
      
    };
  },
  mounted() {},
  computed: {
    snackbar() {
      return this.$store.getters.snackbar;
    }
  },
  watch: {
    $route(to, from) {
      document.title = to.meta.title || "Tome Default Title";
    }
  },
  methods:{
      loctionUpdated(location){
          this.school.location.lat=location.lat
          this.school.location.lng=location.lng
      },
      saveData(){
          
      }
  }
};
</script>
