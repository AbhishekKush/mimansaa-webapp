<template>
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
          :prepend-icon="item.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          <v-list-tile
            v-for="(child, i) in item.children"
            :key="i"
            @click
            :to="{path: child.path}"
            exact
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ child.text }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-else :key="item.text" @click :to="{path: item.path} " exact>
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
</template>

<script>
export default {
  data() {
    return {
      menu: [
        { icon: "phonelink", text: "Dashboard", path: "/admin" },
        {
          icon: "business",
          text: "Schools",
          model: true,
          children: [
            {
              text: "All Schools",
              path: "/admin/AllSchools"
            },
            {
              text: "Add School",
              path: "/admin/AddSchool"
            }
          ]
        },
        {
          icon: "directions_bus",
          text: "Transportors",
          model: true,
          children: [
            {
              text: "All Transporters",
              path: "/admin/AllTransporters"
            },
            {
              text: "Add Transporter",
              path: "/admin/AddTransporters"
            }
          ]
        },
          {
          icon: "account_circle",
          text: "Users",
          model: true,
          children: [
            {
              text: "All Users",
              path: "/admin/AllUsers"
            },
            {
              text: "Add User",
              path: "/admin/AddUser"
            }
          ]
        },
        {
          icon: "settings",
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
        { icon: "settings", text: "Settings", path: "settings" }
      ]
    };
  },
  props: ["drawer"],
  watch: {},
  created() {
    console.log("Menu loaded");
  },
  methods: {}
};
</script>