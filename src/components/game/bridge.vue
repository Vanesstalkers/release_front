<template>
  <div 
    class="bridge" 
    :id="bridge._id"
    :style="{ left: bridge.left + 'px', top: bridge.top + 'px' }"
  >
    <div class="zone-wraper" >
      <plane-zone v-for="zone in bridge.zoneList" v-bind:zone="zone" :key="zone._id" />
    </div>
  </div>
</template>

<script>
import planeZone from '../../components/game/planeZone.vue';

export default {
  name: 'bridge',
  components: {
    planeZone
  },
  props: {
    bridge: Object,
  },
  methods: {

  },
  mounted() {
    console.log('bridge mounted', this.bridge);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bridge {
  position: absolute;
  margin-left: -73px;
	margin-top: -36px;
}
</style>
