<template>
  <div>
    <div>
      <h3>Search and add a pin</h3>
      <label>
        <gmap-autocomplete @place_changed="setPlace"  class="form-control" style="width: 100%;font-size:16px;border-bottom:1px solid #949494"></gmap-autocomplete>
      </label>
      <br>
    </div>
    <br>
    <gmap-map
      :center="center"
      :zoom="10"
      ref="map"
      style="width:100%;  height: 400px;"
      @center_changed="updateCenter"
      class="map-container"
    >
      <GmapMarker :draggable="true" :position="reportedCenter" @dragend="setMarker"/>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  data() {
    return {
      center: { lat: 26.847320322892934, lng: 80.9370633546007 },
      mapTypeId: "terrain",
      currentPlace: null,
      reportedCenter: {
        lat: 26.847320322892934,
        lng: 80.9370633546007
      },
      mapCenter: null
    };
  },
  created() {
    this.sync();
  },
  methods: {
    updateCenter(latLng) {
      this.reportedCenter = {
        lat: latLng.lat(),
        lng: latLng.lng()
      };
      this.$emit('locationChanged',this.reportedCenter)
    },
    sync() {
      this.mapCenter = this.center;
    },
    setMarker(latLng){
      let location= latLng.latLng
      this.reportedCenter.lat=location.lat();
      this.reportedCenter.lng=location.lng();
      this.$emit('locationChanged',this.reportedCenter)
    },
    // receives a place object via the autocomplete component
    setPlace(place) {
      if (place && place.geometry && place.geometry.location) {
        this.center.lat = place.geometry.location.lat();
        this.center.lng = place.geometry.location.lng();
        this.reportedCenter.lat=place.geometry.location.lat();
        this.reportedCenter.lng=place.geometry.location.lng();
      }
    }
  }
};
</script>