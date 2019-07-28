<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex md12>
        <v-card-title>
          <h2 class="display-1 font-weight-light">All Transporters</h2>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search Transporter"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          v-model="selected"
          :headers="headers"
          :search="search"
          :loading="loading"
          :items="transporters"
          :pagination.sync="pagination"
          select-all
          item-key="uid"
          class="elevation-1"
        >
          <template v-slot:headers="props">
            <tr>
              <th>
                <v-checkbox
                  :input-value="props.all"
                  :indeterminate="props.indeterminate"
                  primary
                  hide-details
                  @click.stop="toggleAll"
                ></v-checkbox>
              </th>
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
              <td>
                <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
              </td>
              <td class="text-xs-center subheading">
                <router-link
                  :to="{path: '/admin/transporter/'  + props.item.uid }"
                  tag="a"
                  style="cursor: pointer"
                >{{ props.item.name }}</router-link>
              </td>
              <td class="text-xs-center">{{ props.item.no_vehicle }}</td>
              <td class="text-xs-center">{{ props.item.no_child }}</td>
              <td class="text-xs-center">{{ props.item.phone }}</td>
              <td class="justify-center dense px-0">
                <v-btn
                  color="primary"
                  fab
                  small
                  dark
                  :to="{path: '/admin/EditTransporter/'  + props.item.uid }"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn color="error" fab small dark @click="deleteItem(props.item)">
                  <v-icon>delete_forever</v-icon>
                </v-btn>
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
  data() {
    return {
      transporters: [],

      pagination: {
        sortBy: "name"
      },
      search: "",
      selected: [],
      headers: [
        {
          text: "Transporter Name",
          align: "left",
          value: "name"
        },
        { text: "No. Vehicle", value: "no_vehicle" },
        { text: "No. Child", value: "no_child" },
        { text: "Phone No.", value: "phone" },
        { text: "Actions", value: "name", sortable: false }
      ]
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    }
  },
  created() {
    this.loadTransporters();
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.schools.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      console.log(item.id);
      const index = this.transporters.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.transporters.splice(index, 1);
      var node = firebase
        .database()
        .ref("info_school")
        .child(item.id);
      node
        .remove()
        .then(function() {
          console.log("Remove succeeded.");
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message);
        });
    },

    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.transporters.slice();
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    loadTransporters() {
      this.transporters = [];
      this.$store.dispatch("setMainLoading", true);
      firebase
        .database()
        .ref("all_users/")
        .orderByChild("user_type")
        .equalTo("transporter")
        .once("value")
        .then(snapshot => {
          const obj = snapshot.val();
          var index = 0;
          for (let key in obj) {
            this.transporters.push({
              uid: key,
              name: obj[key].name,
              no_vehicle: 0,
              no_child: 0,
              phone: obj[key].phone
            });
            this.countVehicle(key, index);
            this.countChild(key, index);
            index++;
          }
          this.$store.dispatch("setMainLoading", false);
        });
    },
    countVehicle(transporterUid, index) {
      firebase
        .database()
		.ref("transporter_vehicle/")
		.child(transporterUid)
        .once("value", transporterVehicle => {
          const vehicleObj = transporterVehicle.val();
          for (let vKey in vehicleObj) {
              this.transporters[index].no_vehicle = transporterVehicle.numChildren();
          }
        });
    },
    countChild(transporterUid, index) {
    let  count = 0 
      firebase
        .database()
        .ref("info_vehicle/")
        .orderByChild("owner_or_transporter_id")
        .equalTo(transporterUid)
        .once("value", vehicleInfo => {
          const vehicleObj = vehicleInfo.val();
          for (let vKey in vehicleObj) {
            count  = count + vehicleObj[vKey].occupied_seats
          }
          this.transporters[index].no_child = count
        });
    }
  }
};
</script>