<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex md12>
        <v-card-title>
          <h2 class="display-1 font-weight-light">All Users</h2>
          <v-btn color="primary" dark class="mb-2" @click="addUserDialog = true">ADD USER</v-btn>
          <v-dialog v-model="addUserDialog" persistent max-width="800px">
            <v-card>
              <v-card-title class="headline headline grey lighten-2">Add New User</v-card-title>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-text-field label="Name*" v-model="newUser.name" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      label="Phone No"
                      v-model="newUser.phone"
                      hint="10 digit mobile no."
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md9>
                    <v-text-field
                      label="Address*"
                      v-model="newUser.address"
                      hint="Type full address along with pincode"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md3>
                    <v-btn color="blue-grey darken-2" outline @click="locationDialog = true">
                      <v-icon dark left>location_on</v-icon>Pick Location
                    </v-btn>
                    <v-dialog v-model="locationDialog" max-width="800px" persistent>
                      <v-card>
                        <v-card-title class="headline grey lighten-2" primary-title>Set Location</v-card-title>
                        <set-map class="pa-4" @locationChanged="loctionUpdated"/>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="primary"
                            flat="flat"
                            @click="locationDialog = false"
                          >Disagree</v-btn>
                          <v-btn color="primary" @click="saveChangedLocation()">Save Location</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Email*" v-model="newUser.email" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 md8>
                    <v-text-field
                      label="Password*"
                      v-model="password"
                      :type="pVisibility ? 'text' : 'password'"
                      :append-icon="pVisibility ? 'visibility' : 'visibility_off'"
                      required
                      @click:append="toggleVisibility()"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-btn color="primary" outline @click="generatePassword()">
                      <v-icon dark left>autorenew</v-icon>Generate Password
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm12>
                    <v-radio-group v-model="newUser.user_type" row required color="primary">
                      <v-radio label="Web Admin" value="webadmin" color="error"></v-radio>
                      <v-radio label="Transporter" value="transporter" color="primary"></v-radio>
                      <v-radio label="Driver" value="driver" color="primary"></v-radio>
                      <v-radio label="Parent" value="parent" color="primary"></v-radio>
                      <v-radio label="Guard" value="guard" color="primary"></v-radio>
                    </v-radio-group>
                  </v-flex>
                </v-layout>
              </v-container>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="addUserDialog = false">Close</v-btn>
                <v-btn color="primary darken-1" @click="addNewUser()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search User"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          v-model="selected"
          :headers="headers"
          :search="search"
          :loading="loading"
          :items="filteredUsers"
          :pagination.sync="pagination"
          select-all
          item-key="uid"
          class="elevation-1"
        >
          <template v-slot:headers="props">
            <tr class="grey lighten-3">
              <th>
                <v-icon>filter_list</v-icon>
              </th>
              <th>
              </th>
              <th  class="customFilter">
                <div v-if="filters.hasOwnProperty('user_type')">
                  <v-select
                    flat
                    hide-details
                    small
                    multiple
                    clearable
                    :items="columnValueList('user_type')"
                    label="Filter Role"
                    v-model="filters['user_type']"
                  ></v-select>
                </div>
              </th>
              <th>
              </th>
              <th colspan="2">
                <v-btn color="primary" dark class="mb-2" @click="loadUsers">REFRESH USER</v-btn>
              </th>
            </tr>
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
              <td class="text-xs-center subheading primay-field">
                <router-link
                  :to="{path: '/admin/User/'  + props.item.uid }"
                  tag="a"
                  style="cursor: pointer"
                >{{ props.item.name }}</router-link>
              </td>
              <td class="text-xs-center">{{ props.item.user_type }}</td>
              <td class="text-xs-center">{{ props.item.email }}</td>
              <td class="text-xs-center">{{ props.item.phone }}</td>
              <td class="justify-center dense px-0">
                <v-btn
                  color="primary"
                  fab
                  small
                  dark
                  :to="{path: '/admin/EditUser/'  + props.item.uid }"
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
import setMap from "@/components/setMap";

export default {
  components: {
    setMap
  },
  data() {
    return {
      addUserDialog: false,
      locationDialog: false,
      pVisibility: false,
      templat: null,
      templng: null,
      password: "",
      newUser: {
        name: "",
        phone: "",
        phone_verified: true,
        address: "",
        home_latitude: "",
        home_longitude: "",
        status_active: true,
        email: "",
        email_verified: true,
        user_type: ""
      },
      selected: [],
      filters: {
        user_type: []
      },
      users: [],
      pagination: {
        sortBy: "name"
      },
      search: "",
      selected: [],
      headers: [
        {
          text: "Name",
          align: "left",
          value: "name"
        },
        { text: "Role", value: "user_type" },
        { text: "Email", value: "email" },
        { text: "Phone No.", value: "phone" },
        { text: "Actions", value: "name", sortable: false }
      ]
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    filteredUsers() {
      return this.users.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f]);
        });
      });
    }
  },
  created() {
    //console.log(firebase.auth().currentUser);
    this.loadUsers();
  },
  methods: {
    addNewUser() {
      var createUser = firebase.functions().httpsCallable("createWUser");
      var newUser = this.newUser
      createUser({
        email: this.newUser.email,
        password: this.password,
        phone: this.newUser.phone,
        name: this.newUser.name
      })
        .then(result=> {
          console.log(result.data.user.uid)
          var currentTimestamp = Date.now()
          var uid = result.data.user.uid
          const ref = firebase.database().ref("all_users/");
          ref
            .child(uid)
            .set(newUser)
            .then(data => {
              ref.child(uid).update({ uid: uid, addedOn: currentTimestamp })
              this.addUserDialog=false
              this.resetAddUserField()
              this.loadUsers()
              this.$store.dispatch("showSnackbar", {
                snackbar: {
                  message: "User added successfully",
                  type: "success"
                }
              })
            })
            .catch(error => {
              console.log(error);
              this.$store.dispatch("showSnackbar", {
                snackbar: {
                  message: error.message,
                  type: "error"
                }
              });
            });
        })
        .catch(error=> {
          console.log(error)
          this.$store.dispatch("showSnackbar", {
            snackbar: {
              message: error.message,
              type: "error"
            }
          });
        });
    },
    toggleVisibility() {
      this.pVisibility = !this.pVisibility;
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
    },
    saveChangedLocation() {
      this.locationDialog = false;
      this.newUser.lat = this.templat;
      this.newUser.lng = this.templng;
    },
    loctionUpdated(location) {
      this.templat = location.lat;
      this.templng = location.lng;
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // this.dialog = true;
    },

    deleteItem(item) {
      console.log(item.uid);
      const index = this.users.indexOf(item);
      var isConfirm = confirm("Are you sure you want to delete this user?") &&this.users.splice(index, 1);
      var node = firebase.database().ref("all_users").child(item.uid)
      if(isConfirm){
        node.remove().then(function() {
          console.log("Remove succeeded.");
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message);
        });
      }
        
    },

    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.users.slice();
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },

    columnValueList(val) {
      return this.users.map(d => d[val]);
    },

    resetAddUserField(){
      this.newUser.name="",
      this.newUser.phone="",
      this.newUser.address="",
      this.newUser.home_latitude="",
      this.newUser.home_longitude="",
      this.newUser.email="",
      this.newUser.user_type=""

    },
    loadUsers() {
      this.users= []
      this.$store.dispatch("setMainLoading", true);
      firebase
        .database()
        .ref("all_users")
        .once("value")
        .then(data => {
          const obj = data.val();
          for (let key in obj) {
            this.users.push({
              uid: key,
              name: obj[key].name,
              email: obj[key].email,
              phone: obj[key].phone,
              user_type: obj[key].user_type
            });
          }
          this.$store.dispatch("setMainLoading", false);
        });
    }
  }
};
</script>