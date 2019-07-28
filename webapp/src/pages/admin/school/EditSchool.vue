<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap v-if="loaded ">
      <v-flex md8>
        <h1 class="display-1 font-weight-light">Edit School</h1>
        <v-card class="pa-4 mt-4">
          <v-form v-model="valid" ref="editedForm">
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
              <v-card>
                <v-card-title class="py-2 title grey lighten-2">
                  <span class>Set Location</span>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-card-title>
                <set-map class="pa-4" @locationChanged="loctionUpdated" />
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat="flat" @click="dialog = false">Disagree</v-btn>
                  <v-btn color="primary" @click="saveChangedLocation()">Save Location</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <view-map :center="{lat:editedSchool.latitude,lng:editedSchool.longitude}" />
            <input type="hidden" v-model="editedSchool.latitude" />
            <input type="hidden" v-model="editedSchool.longitude" />
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
        <h1 class="display-1 font-weight-light">School Guards</h1>
        <v-layout row wrap class="pt-3">
          <v-flex md12>
            <v-autocomplete
              v-model="selectedGuard"
              :loading="searchingGuard"
              :items="suggestedGuards"
              item-text="name"
              :search-input.sync="searchGuard"
              cache-items
              hide-no-data
              clearable
              hide-details
              label="Search Guard "
              solo
            >
              <template v-slot:item="data">
                <!-- <v-list-tile @click> -->
                <v-list-tile-content @click="assignThisGuard(data.item.uid)">
                  <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="data.item.email"></v-list-tile-sub-title>
                </v-list-tile-content>
                <!-- </v-list-tile> -->
              </template>
            </v-autocomplete>
          </v-flex>
          <v-flex>
            <v-card>
              <v-toolbar color="primary" dark height="48px">
                <v-toolbar-title class="text-xs-center subheading">Guard List</v-toolbar-title>
              </v-toolbar>

              <v-list>
                <v-list-tile v-for="guard in guardList" :key="guard.email" avatar @click>
                  <!-- <v-list-tile-avatar>
                  <img :src="guard.avatar" />
                  </v-list-tile-avatar>-->

                  <v-list-tile-content>
                    <v-list-tile-title v-html="guard.name"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="guard.email"></v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn color="error" fab small dark @click="unassignThisGuard(guard.uid)">
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <div id="map"></div>
    </v-layout>
    <v-layout v-else-if="noRecordFound">
      <v-flex md8>
        <v-card>
          <v-alert :value="true" type="error" style="text-align:left">No record found</v-alert>
        </v-card>
      </v-flex>
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
      noRecordFound: false,
      valid: false,
      dialog: false,
      loaded: false,
      loading: false,
      templat: null,
      templng: null,
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
        v =>
          /^((\+){1}91){1}[1-9]{1}[0-9]{9}$/.test(v) || "Enter valid phone no."
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
      toAmPmRules: [v => !!v || "AM/PM is required"],
      selectedGuard: "",
      searchGuard: "",
      searchingGuard: false,
      suggestedGuards: [],
      guardList: []
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
    this.listGuard();
  },
  watch: {
    searchGuard(value) {
      if (value) value = value.toUpperCase();
      else return;
      this.searchingGuard = true;
      firebase
        .database()
        .ref("all_users/")
        .orderByChild("user_type")
        .equalTo("guard")
        .once("value")
        .then(snapshot => {
          const obj = snapshot.val();
          let myList = [];
          let tempGuard = "";
          for (let key in obj) {
            tempGuard = obj[key].name.toUpperCase();
            if (tempGuard.includes(value.toUpperCase())) {
              myList.push({
                uid: key,
                name: obj[key].name,
                email: obj[key].email
              });
            }
          }
          this.suggestedGuards = myList;
          this.searchingGuard = false;
          // console.log(myList);
        });
    }
  },
  methods: {
    loctionUpdated(location) {
      this.templat = location.lat;
      this.templng = location.lng;
    },
    saveChangedLocation() {
      this.dialog = false;
      this.editedSchool.latitude = this.templat;
      this.editedSchool.longitude = this.templng;
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
          if (data.val()) {
            this.editedSchool = data.val();
            this.loaded = true;
            this.validateEditedForm();
          } else {
            this.noRecordFound = true;
            this.$store.dispatch("showSnackbar", {
              snackbar: {
                message: "No record found",
                type: "error"
              }
            });
          }
          this.$store.dispatch("setMainLoading", false);
        });
    },
    listGuard() {
      firebase
        .database()
        .ref("info_guard/")
        .orderByChild("school_id")
        .equalTo(this.id)
        .once("value")
        .then(snapshot => {
          const obj = snapshot.val();
          let myList = [];
          for (let key in obj) {
            myList.push({
              uid: key
            });
          }
          this.setGuardList(myList);
        });
    },
    setGuardList(myList) {
      this.guardList = [];
      myList.forEach(guard => {
        firebase
          .database()
          .ref("all_users/")
          .orderByChild("uid")
          .equalTo(guard.uid)
          .once("value")
          .then(details => {
            const guardObj = details.val();
            for (let key in guardObj) {
              this.guardList.push({
                uid: key,
                name: guardObj[key].name,
                email: guardObj[key].email
              });
            }
          });
      });
    },
    async assignThisGuard(uid) {
      let res = await this.$dialog.confirm({
        text: "Are you sure?",
        title: "Confirm",
        persistent: true
      });
      const details = {
        uid: uid,
        school_id: this.id
      };
      if (res === true) {
        firebase
          .database()
          .ref("info_guard/" + uid)
          .once("value")
          .then(async data => {
            var guardDetail = data.val();
            if (guardDetail.school_id) {
              let result = await this.$dialog.confirm({
                text:
                  "This guard is already assigned, are you want to change ?",
                title: "Confirm",
                width: 450,
                persistent: true
              });
              if (result === true) {
                const ref = firebase.database().ref("info_guard/");
                ref
                  .child(uid)
                  .set(details)
                  .then(data => {
                    this.$store.dispatch("showSnackbar", {
                      snackbar: {
                        message: "Guard Assigned Successfully",
                        type: "success"
                      }
                    });
                    this.listGuard();
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
            } else {
              const ref = firebase.database().ref("info_guard/");
              ref
                .child(uid)
                .set(details)
                .then(data => {
                  this.$store.dispatch("showSnackbar", {
                    snackbar: {
                      message: "Guard Assigned Successfully",
                      type: "success"
                    }
                  });
                  this.listGuard();
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
          });
      }
    },
    async unassignThisGuard(uid) {
      let res = await this.$dialog.confirm({
        text: "Are you sure?",
        title: "Confirm",
        persistent: true
      });
      if (res === true) {
        const ref = firebase.database().ref("info_guard/");
        ref
          .child(uid)
          .update({ school_id: "" })
          .then(data => {
            this.$store.dispatch("showSnackbar", {
              snackbar: {
                message: "Guard Unassigned Successfully",
                type: "success"
              }
            });
            this.listGuard();
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
    validateEditedForm() {
      if (this.$refs.editedForm) {
        this.$refs.editedForm.validate();
      } else {
        setTimeout(() => {
          this.validateEditedForm();
        }, 500);
      }
    }
  }
};
</script>
