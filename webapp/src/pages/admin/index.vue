<template>
<div>
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" fixed app>
        <v-list dense>
        <template v-for="item in menu">
            <v-layout v-if="item.heading" :key="item.heading" row align-center>
            <v-flex xs6>
                <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
                <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
            </v-layout>
            <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
            >
            <template v-slot:activator>
                <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                </v-list-tile-content>
                </v-list-tile>
            </template>
            <v-list-tile v-for="(child, i) in item.children" :key="i" @click>
                <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ child.text }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            </v-list-group>
            <v-list-tile v-else :key="item.text" @click>
            <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
            </v-list-tile>
        </template>
        </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed>
        <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
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
          <v-avatar size="32px"  tile>
            <img src="https://cdn.vuetifyjs.com/images/logos/v-alt.svg" alt="Vuetify">
          </v-avatar>
        </v-btn>
        <v-list >
          <v-list-tile ripple v-for="(item, i) in sitems" :key="i">
            <v-list-tile-title>{{ item.title}}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile  @click="logout">
            <v-list-tile-title >Logout</v-list-tile-title>
          </v-list-tile>
<!-- 
          <router-link to="/admin/category">
            <v-list-tile >
              <v-list-tile-title>Admin</v-list-tile-title>
            </v-list-tile>
          </router-link> -->
          
          
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
        <v-layout >
            <router-view/>
        </v-layout>
    </v-content>
    <v-btn fab bottom right color="pink" dark fixed>
        <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        drawer: null,
        loading: false,
        items: [],
        search: null,
        select: null,
        sitems: [
        { title: 'Setting' },
        { title: 'User' },
        
      ],
        menu: [
      { icon: "contacts", text: "Contacts" },
      { icon: "history", text: "Frequently contacted" },
      { icon: "content_copy", text: "Duplicates" },
      {
        icon: "keyboard_arrow_up",
        "icon-alt": "keyboard_arrow_down",
        text: "Labels",
        model: true,
        children: [{ icon: "add", text: "Create label" }]
      },
      {
        icon: "keyboard_arrow_up",
        "icon-alt": "keyboard_arrow_down",
        text: "More",
        model: false,
        children: [
          { text: "Import" },
          { text: "Export" },
          { text: "Print" },
          { text: "Undo changes" },
          { text: "Other contacts" }
        ]
      },
      { icon: "settings", text: "Settings" },
      { icon: "chat_bubble", text: "Send feedback" },
      { icon: "help", text: "Help" },
      { icon: "phonelink", text: "App downloads" },
      { icon: "keyboard", text: "Go to the old version" }
        ],
        states: [
          'Alabama',
          'Alaska',
          'American Samoa',
          'Arizona',
          'Arkansas',
          'California',
          'Colorado',
          'Connecticut',
          'Delaware',
          'District of Columbia',
          'Federated States of Micronesia',
          'Florida',
          'Georgia',
          'Guam',
          'Hawaii',
          'Idaho',
          'Illinois',
          'Indiana',
          'Iowa',
          'Kansas',
          'Kentucky',
          'Louisiana',
          'Maine',
          'Marshall Islands',
          'Maryland',
          'Massachusetts',
          'Michigan',
          'Minnesota',
          'Mississippi',
          'Missouri',
          'Montana',
          'Nebraska',
          'Nevada',
          'New Hampshire',
          'New Jersey',
          'New Mexico',
          'New York',
          'North Carolina',
          'North Dakota',
          'Northern Mariana Islands',
          'Ohio',
          'Oklahoma',
          'Oregon',
          'Palau',
          'Pennsylvania',
          'Puerto Rico',
          'Rhode Island',
          'South Carolina',
          'South Dakota',
          'Tennessee',
          'Texas',
          'Utah',
          'Vermont',
          'Virgin Island',
          'Virginia',
          'Washington',
          'West Virginia',
          'Wisconsin',
          'Wyoming'
        ]
      }
    },
    props: {
    source: String
    },
    watch: {
      search (val) {
        val && val !== this.select && this.querySelections(val)
      }
    },
    methods: {
      querySelections (v) {
        this.loading = true
        // Simulated ajax query
        setTimeout(() => {
          this.items = this.states.filter(e => {
            return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
          })
          this.loading = false
        }, 500)
      },
      logout(){
        this.$store.dispatch('userSignOut')
      }
    }
  }
</script>