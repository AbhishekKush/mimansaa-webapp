<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex md12>
        <v-card-title>
          <h2 class="display-1 font-weight-light">All Schools</h2>
          <v-btn color="primary" dark class="mb-2 " :to="{path: '/admin/addSchool'}">New Item</v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search School"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          v-model="selected"
          :headers="headers"
          :search="search"
          :loading="loading"
          :items="schools"
          :pagination.sync="pagination"
          select-all
          item-key="id"
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
            <tr :active="props.selected" >
              <td>
                <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
              </td>
              <td class="text-xs-center subheading"><router-link  :to="{path: '/admin/school/'  + props.item.id }"  tag="a" style="cursor: pointer">{{ props.item.name }}</router-link></td>
              <td class="text-xs-center">{{ props.item.city }}</td>
              <td class="text-xs-center">{{ props.item.phone }}</td>
              <td class="justify-center  dense  px-0">
                <v-btn color="primary" fab small dark  :to="{path: '/admin/EditSchool/'  + props.item.id }">
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-btn color="error" fab small dark>
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
      schools: [],
      pagination: {
        sortBy: "name"
      },
      search: "",
      selected: [],
      headers: [
        {
          text: "School Name",
          align: "left",
          value: "name"
        },
        { text: "City", value: "city" },
        { text: "Phone No.", value: "phone" },
         { text: 'Actions', value: 'name', sortable: false }
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%"
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%"
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%"
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%"
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%"
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%"
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%"
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        }
      ]
    };
  },
computed:{
    loading(){
        return this.$store.getters.loading
    }
},
  created(){
       this.loadSchools()
  },
  methods: {
     editItem (item) {
        this.editedIndex = this.schools.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.schools.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.schools.splice(index, 1)
      },

    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.schools.slice();
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    loadSchools() {
            this.$store.dispatch("setMainLoading", true)
            firebase.database().ref('info_school').once('value')
                .then((data) => {
                    const obj = data.val()
                    for (let key in obj) {
                        this.schools.push({
                            id: key,
                            name: obj[key].name,
                            city: obj[key].city,
                            phone: obj[key].phone
                        })
                    }
                    this.$store.dispatch("setMainLoading", false)
                })
        }
  }
};
</script>