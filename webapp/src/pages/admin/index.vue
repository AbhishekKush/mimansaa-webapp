<template>
  <div>
    <v-progress-linear :indeterminate="true" style="margin:0px;z-index:99;position:fixed" height="3" v-if="isLoading" color="error"></v-progress-linear>
    <menu-left :drawer.sync="drawer"/>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Mimansaa</span>
      </v-toolbar-title>
      <v-autocomplete
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        cache-items
        class="mx-3"
        flat
        hide-no-data
        hide-details
        autocomplete="off"
        label="What state are you from?"
        solo-inverted
      ></v-autocomplete>
      <v-spacer></v-spacer>
      <v-menu left origin="center center" transition="slide-y-transition">
        <v-btn icon large slot="activator">
          <v-avatar size="32px" tile>
            <img src="https://cdn.vuetifyjs.com/images/logos/v-alt.svg" alt="Vuetify">
          </v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile ripple v-for="(item, i) in sitems" :key="i">
            <v-list-tile-title>{{ item.title}}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="logout">
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
          <!-- 
          <router-link to="/admin/category">
            <v-list-tile >
              <v-list-tile-title>Admin</v-list-tile-title>
            </v-list-tile>
          </router-link>-->
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-layout>
        <v-slide-x-reverse-transition mode="out-in">
        <router-view/>
      </v-slide-x-reverse-transition>
      </v-layout>
    </v-content>
    <v-btn fab bottom right color="pink" dark fixed>
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
import MenuLeft from "@/components/admin/menu";
export default {
  components: {
    MenuLeft: MenuLeft
  },
  data() {
    return {
      drawer: true,
      loading:false,
      items: [],
      states: [
        "Alabama",
        "Alaska",
        "American Samoa",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",
        "Federated States of Micronesia",
        "Florida",
        "Georgia",
        "Guam",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Marshall Islands",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Northern Mariana Islands",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Palau",
        "Pennsylvania",
        "Puerto Rico",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virgin Island",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming"
      ],
      search: null,
      select: null,
      sitems: [{ title: "Setting" }, { title: "User" }]
    };
  },
  props: {
    source: String
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
   computed: {

    isLoading(){
      return this.$store.getters.loadingStatus
    }
  },
  methods: {
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.states.filter(e => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
    logout() {
      this.$store.dispatch("userSignOut");
    }
  }
};
</script>