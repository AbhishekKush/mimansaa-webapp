<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex md8>
        <h1 class="display-1 font-weight-light">Add New Transporter</h1>
        <v-card class="pa-4 mt-4">
          <v-form>
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
              v-model="school.phone"
              :rules="phoneRules"
              label="School Phone No."
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
                <v-select
                  :rules="fromHourRules"
                  v-model="school.openHour"
                  v-bind:items="hours"
                  label="Hour"
                  solo
                ></v-select>
              </v-flex>
              <v-flex md3>
                <v-select
                  :rules="fromMinuteRules"
                  v-model="school.openMinute"

                  v-bind:items="minutes"
                  label="Minute"
                  solo
                ></v-select>
              </v-flex>
              <v-flex md3>
                <v-select
                  :rules="fromAmPmRules"
                  v-model="school.openAmPm"

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
                  v-model="school.closeHour"
                  :rules="toHourRules"
                  label="Hour"
                  solo
                ></v-select>
              </v-flex>
              <v-flex md3>
                <v-select
                  v-bind:items="minutes"
                  v-model="school.closeMinute"
                  :rules="toMinuteRules"
                  label="Minute"
                  solo
                ></v-select>
              </v-flex>
              <v-flex md3>
                <v-select
                  :rules="toAmPmRules"
                  v-model="school.closeAmPm"
                  v-bind:items="['AM','PM']"
                  label="AM/PM"
                  solo
                ></v-select>
              </v-flex>
            </v-layout>

            <set-map @locationChanged="loctionUpdated"/>
            <input type="hidden" v-model="school.latitude">
            <input type="hidden" v-model="school.longitude">
            <v-btn :loading="loading" color="primary" @click="saveData">
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
import setMap from "@/components/setMap";
import firebase from "firebase";
export default {
  name: "App",
  components: {
    setMap
  },
  data() {
    return {
      
      school: {
        name: "Kendriya Vidyalay",
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
        closeAmPm: null,
      },
      valid: false,
      loading: false,
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
  mounted() {},
  computed: {},
  methods: {
    loctionUpdated(location) {
      this.school.latitude = location.lat;
      this.school.longitude = location.lng;
    },
    saveData() {
      var currentTimestamp = Date.now()
      var SchoolID = "School_" + currentTimestamp;
      this.loading = true;
      this.$store.dispatch("showSnackbar", {
        snackbar: {
          message: "Saving Data"
        }
      });
      const ref = firebase .database().ref("info_school/")
        ref.child(SchoolID)
        .set(this.school)
        .then(data=> {
            console.log(data)
                    ref.child(SchoolID).update({ "id": SchoolID, "addedOn": currentTimestamp})
                    this.$store.dispatch('showSnackbar', {
                        snackbar: {
                            message: "Data saved successfully",
                            type: "success"
                        }
                    })
                    this.loading = false
                }
          )
           .catch((error) => {
                    console.log(error)
                    this.$store.dispatch('showSnackbar', {
                        snackbar: {
                            message: error,
                            type: "error"
                        }
                    })
                    this.loading = false
                })
    }
  }
};
</script>
