<template>
  <div>

    <gmap-map
      :center="center"
      :zoom="16"
      ref="map"
      style="width:100%;  height: 400px;"
      class="map-container"
    >
      <GmapMarker  :position="center"/>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "viewMap",
  props: {
    center: {
      type:Object,
      default: () => ({
        lat: 26.847320322892934,
        lng: 80.9370633546007
      })
    },
    // reportedCenter: {
    //     type:Object,
    //   default: () => ({
    //     lat: 26.847320322892934,
    //     lng: 80.9370633546007
    //   })
    // }
  },
  data() {
    return {
    //   center: { lat: 26.847320322892934, lng: 80.9370633546007 },
      mapTypeId: "terrain",
    //   reportedCenter: {
    //     lat: 26.847320322892934,
    //     lng: 80.9370633546007
    //   },
      mapCenter: null
    };
  },
  created() {
    this.sync();
  },
  methods: {
    sync() {
      this.mapCenter = this.center;
    },

  }
};
</script>