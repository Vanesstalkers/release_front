<template>
  <div class="plane" :id="plane._id" :style="customStyle">
    <div class="zone-wraper" >
      <plane-zone v-for="zone in plane.zoneList" v-bind:zone="zone" :key="zone._id" />
    </div>
    <div class="port-wraper" >
      <plane-port v-for="port in plane.portList" v-bind:port="port" :key="port._id" />
    </div>
    <div class="custom-bg">
      <span v-for="item in customBG(plane._id)" :key="item.code"
        :style="`background-position-x: ${item.x}; background-position-y: ${item.y}`"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import planeZone from './planeZone.vue';
import planePort from './planePort.vue';

export default {
  name: 'plane',
  components: {
    planePort,
    planeZone
  },
  props: {
    plane: Object, 
  },
  computed: {
    customStyle() {
      const style = {...this.plane} || {};
      if(style.left) style.left += 'px';
      if(style.top) style.top += 'px';
      if(style.width) style.width += 'px';
      if(style.height) style.height += 'px';
      if(style.rotation) style.transform = `rotate(${90 * (style.rotation||0)}deg)`;
      return style;
    },
  },
  methods: {
    customBG(pid){
        let storageFillData = localStorage.getItem('gamePlaneBackgroundData');
        if(storageFillData) try{ storageFillData = JSON.parse(storageFillData) }catch(e){}
        if(!storageFillData) storageFillData = {};
        let fillData = storageFillData[ pid ];

        if(fillData) return fillData;

        fillData = [];

        for(let i = 0; i < 18; i++){
            fillData[i] = {
              x: ( -80*Math.floor((14*Math.random())) )+'px',
              y: ( -80*Math.floor((6*Math.random())) )+'px',
            }
        }
        storageFillData[ pid ] = fillData;
        localStorage.setItem('gamePlaneBackgroundData', JSON.stringify( storageFillData ) );

        return fillData;
    },
    centerPlaneBackground() {
      const p = {},
        gamePlane = document.getElementById("gamePlane");
      const gamePlaneRect = gamePlane.getBoundingClientRect();

      gamePlane.querySelectorAll(".plane").forEach((plane) => {
        const _id = plane.getAttribute("_id");
        const rect = plane.getBoundingClientRect();
        const offsetTop = rect.top - gamePlaneRect.top;
        const offsetLeft = rect.left - gamePlaneRect.left;

        if (p.t == undefined || rect.top < p.t) p.t = rect.top;
        if (p.b == undefined || rect.bottom > p.b) p.b = rect.bottom;
        if (p.l == undefined || rect.left < p.l) p.l = rect.left;
        if (p.r == undefined || rect.right > p.r) p.r = rect.right;

        if (p.ot == undefined || offsetTop < p.ot) p.ot = offsetTop;
        if (p.ol == undefined || offsetLeft < p.ol) p.ol = offsetLeft;
      });

      const gamePlaneCustomStyleData = {
        height: p.b - p.t + "px",
        width: p.r - p.l + "px",
        top: "calc(50% - " + ((p.b - p.t) / 2 + p.ot * 1) + "px)",
        left: "calc(50% - " + ((p.r - p.l) / 2 + p.ol * 1) + "px)",
      };
      this.$store.dispatch('setSimple', { gamePlaneCustomStyleData });
    },
  },
  mounted() {
    console.log('plane mounted', this.plane);
    this.centerPlaneBackground();
    this.$store.dispatch('setSimple', {[this.plane._id]: this.plane});
  }
}
</script>

<style scoped>
  .plane {
    position: relative;
    position: absolute;
    width: 500px;
    height: 250px;
    margin-bottom: 10px;
    transform-origin: 0 0;
  }
  .plane:after {
    content: '';
    z-index: -1;
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: url(../../assets/plane.png);
  }
  .plane > .zone-wraper,
  .plane > .port-wraper {
    z-index: 1;
    position: relative;
  }

	.plane .custom-bg {
		display: flex;
		flex-wrap: wrap;
		border-radius: 20px;
		overflow: hidden;
		position: absolute;
		left: 10px;
		top: 5px;
		width: 480px;
		height: 240px;
		z-index: 0;
		filter: grayscale(75%);
	}
	.plane .custom-bg > span {
		width: 80px;
		height: 80px;
		background-image: url(../../assets/tiles.png);
		background-size: 1120px;
		background-repeat: no-repeat;
	}
</style>
