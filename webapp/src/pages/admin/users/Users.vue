<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex md12>
        <v-card-title>
          <h2 class="display-1 font-weight-light">All Users</h2>
          <v-btn color="primary" dark class="mb-2" @click="addUserDialog = true">ADD USER</v-btn>
          <v-dialog v-model="addUserDialog" persistent max-width="800px">
            <addUser @closeDialog="dialogCloser()" />
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
          :headers="computedHeaders"
          :search="search"
          :loading="loading"
          dense
          :items="filteredUsers"
          :pagination.sync="pagination"
          select-all
          item-key="uid"
          class="elevation-1 usersTable"
        >
          <template v-slot:headers="props">
            <tr class="grey lighten-3">
              <th>
                <v-icon>filter_list</v-icon>
              </th>
              <th></th>
              <th class="customFilter">
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
              <th></th>
              <th></th>
              <th v-if="isFullWidthOn"></th>
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
            <tr :active="props.selected" >
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
              <td class="text-xs-center user-type">{{ props.item.user_type }}</td>
              <td class="text-xs-center status-active">
                <v-icon
                  small
                  :color="props.item.status_active ? 'success' : 'error'"
                >fiber_manual_record</v-icon>
              </td>
              <td class="text-xs-center">{{ props.item.email }}</td>
              <td class="text-xs-center">{{ props.item.phone }}</td>
              <td class="text-xs-center" v-if="isFullWidthOn">{{ props.item.createdOn }}</td>
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
import addUser from "@/components/admin/addUser";
export default {
  components: {
    setMap,
    addUser
  },
  data() {
    return {
      addUserDialog: false,
      locationDialog: false,
      selected: [],
      filters: {
        user_type: []
      },
      users: [],
      pagination: {
        sortBy: "name",
        rowsPerPage: 25
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
        { text: "Active", value: "status_active" },
        { text: "Email", value: "email" },
        { text: "Phone No.", value: "phone" },
        { text: "Created on", value: "createdOn" },
        { text: "Actions", value: "name", sortable: false }
      ]
    };
  },
  computed: {
    isFullWidthOn(){
        return !this.$store.getters.drawer;
    },
    computedHeaders () {
      if(!this.isFullWidthOn){
        return this.headers.filter(header => header.value !== "createdOn")
      }
      
      return this.headers;
    },
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
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // this.dialog = true;
    },

    async deleteItem(item) {
      let res = await this.$dialog.confirm({
        text: "Do you really want to delete this user?",
        title: "Confirm",
        persistent: true
      });
      console.log(item.uid);
      if (res) {
        const index = this.users.indexOf(item);
        this.users.splice(index, 1);
        var deleteUser = firebase.functions().httpsCallable("deleteWUser");
        deleteUser(item.uid)
          .then(result => {
            var node = firebase
              .database()
              .ref("all_users")
              .child(item.uid);

            node.remove().then(data => {
              this.$store.dispatch("showSnackbar", {
                snackbar: {
                  message: "User Deleted",
                  type: "success"
                }
              });
            });
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

    loadUsers() {
      this.users = [];
      this.$store.dispatch("setMainLoading", true);
      firebase
        .database()
        .ref("all_users")
        .once("value")
        .then(data => {
          const obj = data.val();
          for (let key in obj) {
            var date = new Date(obj[key].createdOn)
            this.users.push({
              uid: key,
              name: obj[key].name,
              email: obj[key].email,
              createdOn: date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear(),
              createdOnDetails: date,
              phone: obj[key].phone,
              status_active: obj[key].status_active,
              user_type: obj[key].user_type
            });
          }
          this.$store.dispatch("setMainLoading", false);
        });
    },
    dialogCloser() {
      this.addUserDialog = !this.addUserDialog;
    }
  }
};
</script>