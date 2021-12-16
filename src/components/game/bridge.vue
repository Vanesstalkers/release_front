<template>
  <div 
    class="bridge" 
    :id="bridge._id"
    :style="customStyle"
  >
    <div class="zone-wraper" >
      <plane-zone v-for="zone in bridge.zoneList" v-bind:zone="zone" :key="zone._id" />
    </div>
  </div>
</template>

<script>
import planeZone from './planeZone.vue';

export default {
  name: 'bridge',
  components: {
    planeZone
  },
  props: {
    bridge: Object,
  },
  computed: {
    customStyle() {
      const style = {...this.bridge} || {};
      console.log('style=', style);
      if(style.left) style.left += 'px';
      if(style.top) style.top += 'px';
      if(style.width) style.width += 'px';
      if(style.height) style.height += 'px';
      if(style.rotation) style.transform = `rotate(${90 * (style.rotation||0)}deg)`;
      return style;
    },
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
}
.bridge .zone {
  margin-left: -73px;
	margin-top: -36.5px;
}
.bridge .zone.vertical {
  margin-left: -36.5px;
	margin-top: -73px;
}
</style>
