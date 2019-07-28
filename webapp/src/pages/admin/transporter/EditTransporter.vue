<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex md12 class="mb-4">
        <v-card >
          <v-layout row>
            <v-flex md2>
              <v-img
                max-width="100px"
                class="elevation-6 mt-3 mb-3 ml-4 "
                style="border-radius:50%;"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
              ></v-img>
            </v-flex>
            <v-flex xs10>
                <h2 class="headline text-md-left mt-3">{{ transporter.name }}</h2>
                <h3 class="subtitle-1 font-weight-light text-md-left mt-1">H5GT56</h3>
                <h3 class="caption text-md-left mt-1 grey--text" color="grey">{{transporter.createdOn}}</h3>
            </v-flex>
          </v-layout>
          <!-- <v-divider light></v-divider>
              <v-card-actions class="pa-3">
                Rate this album
                <v-spacer></v-spacer>
                <v-icon>star_border</v-icon>
                <v-icon>star_border</v-icon>
                <v-icon>star_border</v-icon>
                <v-icon>star_border</v-icon>
                <v-icon>star_border</v-icon>
          </v-card-actions>-->
        </v-card>
      </v-flex>
      <v-flex md4>
        <v-card class="tranporterCounter">
          <v-layout row>
            <v-flex xs7>
              <v-card-title primary-title class="pl-5 pt-2">
                <div>
                  <div class="display-3">6</div>
                  <div class="headline">Vehicle</div>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs5>
              <v-icon size="135" color="#3f51b5">commute</v-icon>
            </v-flex>
          </v-layout>
          <!-- <v-divider light></v-divider>
              <v-card-actions class="pa-3">
                Rate this album
                <v-spacer></v-spacer>
                <v-icon>star_border</v-icon>
                <v-icon>star_border</v-icon>
                <v-icon>star_border</v-icon>
                <v-icon>star_border</v-icon>
                <v-icon>star_border</v-icon>
          </v-card-actions>-->
        </v-card>
      </v-flex>
      <v-flex md4>
        <v-card class="tranporterCounter">
          <v-layout row>
            <v-flex xs7>
              <v-card-title primary-title class="pl-5 pt-2">
                <div>
                  <div class="display-3">30</div>
                  <div class="headline">Child</div>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs5>
              <v-icon size="135" color="#3f51b5">face</v-icon>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex md4>
        <v-card class="tranporterCounter">
          <v-layout row>
            <v-flex xs7>
              <v-card-title primary-title class="pl-5 pt-2">
                <div>
                  <div class="display-3">6534</div>
                  <div class="headline">Payment</div>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs5>
              <v-icon size="135" color="#3f51b5">monetization_on</v-icon>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex md12>
        <v-card-title>
          <h2 class="display-1 font-weight-light">Vehicle Details</h2>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search Vehicle"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          v-model="selected"
          :headers="headers"
          :search="search"
          :loading="loading"
          :items="vehicles"
          :pagination.sync="pagination"
          item-key="uid"
          class="elevation-1"
        >
          <template v-slot:headers="props">
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
              >
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr :active="props.selected">
              <td class="text-xs-center subheading">
                <router-link
                  :to="{path: '/admin/transporter/'  + props.item.id }"
                  tag="a"
                  style="cursor: pointer"
                >{{ props.item.vehicle_number }}</router-link>
              </td>
              <td class="text-xs-center">
                <span v-if="props.item.school_name=='Invalid'">Invalid School</span>
                <router-link
                  to="#"
                  v-on:click.native="doSomethingCool($event)"
                  v-else-if="props.item.current_school_id"
                >{{ props.item.school_name }}</router-link>
                <span v-else>Not Assigned</span>
              </td>
              <td class="text-xs-center">{{ props.item.capacity }}</td>
              <td class="text-xs-center">{{ props.item.occupied_seats }}</td>
              <td class="text-xs-center">{{ props.item.type }}</td>
              <td class="text-xs-center">
                <router-link
                  to="#"
                  v-on:click.native="loadDriverModal($event,props.item.current_driver_uid)"
                  v-if="props.item.current_driver_uid"
                >{{ props.item.driver_name }}</router-link>
                <span v-else>Not Assigned</span>
              </td>
              <td class="text-xs-center">
                <v-switch color="success" hide-details></v-switch>
                <!-- <v-btn color="error" fab small dark @click="deleteItem(props.item)">
                  <v-icon>delete_forever</v-icon>
                </v-btn>-->
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  props: ["id"],
  data() {
    return {
      vehicles: [],
      transporter:{
          name:"",
          createdOn:""
      },
      pagination: {
        sortBy: "name"
      },
      search: "",
      selected: [],
      headers: [
        {
          text: "Vehicle Number",
          align: "left",
          value: "vehicle_number"
        },
        { text: "School", value: "school_name" },
        { text: "Capacity", value: "capacity" },
        { text: "Occupied", value: "occupied_seats" },
        { text: "Type", value: "type" },
        { text: "Driver", value: "driver_name" },
        { text: "Offroad", value: "name", sortable: false }
      ]
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    }
  },
  created() {
      this.loadProfile()
    this.loadVehicle();
  },
  methods: {
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    loadProfile(){
        firebase.database().ref('all_users/')
        .child(this.id)
        .once("value")
        .then(snapshot=>{
            const myObj = snapshot.val()
            this.transporter.name = myObj.name
            var time =  new Date(myObj.addedOn)
            this.transporter.createdOn = time.toString()
              firebase.database().ref('all_users/')
        .child(this.id)
        .once("value")

        })
    },
    loadVehicle() {
      this.vehicles = [];
      this.$store.dispatch("setMainLoading", true);
      const vehicleRef = firebase.database().ref("info_vehicle/");
      firebase
        .database()
        .ref("transporter_vehicle/")
        .child(this.id)
        .once("value")
        .then(snapshot => {
          const obj = snapshot.val();
          var index = 0;
          for (let key in obj) {
            vehicleRef
              .child(key)
              .once("value")
              .then(detailSnapshot => {
                const vehicleDetail = detailSnapshot.val();
                // console.log(vehicleDetail)
                this.vehicles.push({
                  addedOn: vehicleDetail.addedOn,
                  capacity: vehicleDetail.capacity,
                  school_name: "",
                  driver_name: "",
                  current_driver_uid: vehicleDetail.current_driver_uid,
                  current_school_id: vehicleDetail.current_school_id,
                  id: vehicleDetail.id,
                  occupied_seats: vehicleDetail.occupied_seats,
                  type: vehicleDetail.type,
                  vehicle_number: vehicleDetail.vehicle_number
                });
                this.setSchool(vehicleDetail.current_school_id, index);
                this.setDriver(vehicleDetail.current_driver_uid, index);
                index++;
              });
          }
          this.$store.dispatch("setMainLoading", false);
        });
    },
    setSchool(school_id, index) {
      if (!school_id) {
        this.vehicles[index].school_name = "Not Assigned";
        return;
      }
      firebase
        .database()
        .ref("info_school/")
        .child(school_id)
        .once("value", schoolSnpashot => {
          if (schoolSnpashot.exists()) {
            this.vehicles[index].school_name = schoolSnpashot
              .child("name")
              .val();
          } else {
            this.vehicles[index].school_name = "Invalid";
          }
        });
    },
    setDriver(driver_uid, index) {
      if (!driver_uid) {
        return;
      }
      firebase
        .database()
        .ref("all_users/")
        .child(driver_uid)
        .once("value", driverSnpashot => {
          if (driverSnpashot.exists()) {
            this.vehicles[index].driver_name = driverSnpashot
              .child("name")
              .val();
          } else {
            this.vehicles[index].driver_name = "Invalid";
          }
        });
    },
    doSomethingCool(e) {
      e.preventDefault();
      console.log("cool");
    }
  }
};
</script>