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
import planeZone from '../../components/game/planeZone.vue';
import planePort from '../../components/game/planePort.vue';

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
      //const style = this.$store.state[this.plane._id]?.style || {};
      const style = {...this.plane} || {};
      if(style.left) style.left += 'px';
      if(style.top) style.top += 'px';
      if(style.width) style.width += 'px';
      if(style.height) style.height += 'px';
      if(style.rotation) style.transform = `rotate(${90 * (style.rotation||0)}deg)`;
      console.log("computed customStyle", style, 'plane=', this.plane);
      return style;
    },
    customStyleLeft() {
      const val = this.customStyle.left;
      console.log("customStyleLeft", val, this.plane);
      return val;
    }
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
  },
  mounted() {
    console.log('plane mounted', this.plane);
    this.$emit('centerPlaneBackground');
    this.$store.dispatch('setSimple', {[this.plane._id]: this.plane});
    
    // setInterval(()=>{
    //   const style = {color: Date.now()%2?'red':'blue'};
    //   this.$store.dispatch('setSimple', {[this.plane._id]: Object.assign({...this.plane}, {style})});
    // }, 1000);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
