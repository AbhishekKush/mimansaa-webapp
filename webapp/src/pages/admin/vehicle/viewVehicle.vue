<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex md8>
        <h1 class="display-1 font-weight-light">Showing Vehicle</h1>
        <v-card class="pa-4 mt-4">
          
        </v-card><view-map :center="{lat:editedSchool.latitude,lng:editedSchool.longitude}"/>
      </v-flex>

      <v-flex md4>
        <h1 class="display-1 font-weight-light"></h1>
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
