<template>
  <div
    v-if="plane._id"
    :class="['plane', ...Object.values(customClass)]"
    :style="customStyle"
    v-on:click.stop="selectPlane"
  >
    <div class="zone-wraper">
      <plane-zone v-for="id in zoneIds" :key="id" v-bind:zoneId="id" :linkLines="linkLines" />
    </div>
    <div class="port-wraper">
      <plane-port v-for="id in portIds" :key="id" v-bind:portId="id" :linkLines="linkLines" />
    </div>
    <div class="custom-bg">
      <span
        v-for="item in customBG(plane._id)"
        :key="item.code"
        :style="`background-position-x: ${item.x}; background-position-y: ${item.y}`"
      />
    </div>
    <div class="links-bg"></div>
    <svg>
      <line
        v-for="[key, line] in Object.entries(linkLines)"
        :key="key"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        fill="none"
        stroke="yellow"
        stroke-width="10"
      />
    </svg>
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
    planeZone,
  },
  data() {
    return { linkLines: {}, customClass: {}, inHandStyle: {} };
  },
  props: {
    planeId: String,
    inHand: Boolean,
  },
  computed: {
    ...mapGetters({
      getSimple: 'getSimple',
    }),
    plane() {
      return this.getSimple(this.planeId, 'plane');
    },
    customStyle() {
      const style = { ...this.plane, ...(this.inHand ? this.inHandStyle : {}) } || {};
      if (style.left) style.left += 'px';
      if (style.top) style.top += 'px';
      if (style.width) style.width += 'px';
      if (style.height) style.height += 'px';
      if (style.rotation) {
        const rotateDegree = 90 * (style.rotation || 0);
        style.transform = `rotate(${rotateDegree}deg)`;
        this.customClass = { ...this.customClass, rotate: `rotate${rotateDegree}` };
      }
      return style;
    },
    zoneIds() {
      return Object.keys(this.plane.zoneMap || {});
    },
    portIds() {
      return Object.keys(this.plane.portMap || {});
    },
  },
  methods: {
    async selectPlane(event) {
      const $plane = event.target.closest('.plane');
      if ($plane.closest('.player-hands')) {
        this.$store.commit('setAvailablePorts', []);
        await api.game
          .action({ name: 'getPlanePortsAvailability', data: { joinPlaneId: this.planeId } })
          .then(({ availablePorts }) => {
            this.$store.commit('setAvailablePorts', availablePorts);
          })
          .catch((err) => {
            console.log({ err });
            alert(err.message);
          });
      }
    },
    customBG(pid) {
      let storageFillData = localStorage.getItem('gamePlaneBackgroundData');
      if (storageFillData)
        try {
          storageFillData = JSON.parse(storageFillData);
        } catch (e) {}
      if (!storageFillData) storageFillData = {};
      let fillData = storageFillData[pid];

      if (fillData) return fillData;

      fillData = [];

      for (let i = 0; i < 18; i++) {
        fillData[i] = {
          x: -80 * Math.floor(14 * Math.random()) + 'px',
          y: -80 * Math.floor(6 * Math.random()) + 'px',
        };
      }
      storageFillData[pid] = fillData;
      localStorage.setItem('gamePlaneBackgroundData', JSON.stringify(storageFillData));

      return fillData;
    },
    centerPlaneBackground() {
      const p = {},
        gamePlane = document.getElementById('gamePlane');
      const gamePlaneRect = gamePlane.getBoundingClientRect();

      gamePlane.querySelectorAll('.plane').forEach((plane) => {
        const _id = plane.getAttribute('_id');
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
        height: p.b - p.t + 'px',
        width: p.r - p.l + 'px',
        top: 'calc(50% - ' + ((p.b - p.t) / 2 + p.ot * 1) + 'px)',
        left: 'calc(50% - ' + ((p.r - p.l) / 2 + p.ol * 1) + 'px)',
      };
      this.$store.dispatch('setSimple', { gamePlaneCustomStyleData });
    },
  },
  mounted() {
    // $nextTick не всегда помогает при запуске новой игры
    setTimeout(() => {
      // this.$nextTick(() => {
        if (this.inHand) {
          this.customClass = { ...this.customClass, inHand: `in-hand` };
        } else this.inHandStyle = {};
        this.centerPlaneBackground();
      // });
    }, 100);
  },
};
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
  filter: blur(2px);
  --filter: grayscale(75%);
  --filter: grayscale(100%) brightness(200%) blur(2px);
}
.plane .custom-bg > span {
  width: 80px;
  height: 80px;
  background-image: url(../../assets/tiles.png);
  background-size: 1120px;
  background-repeat: no-repeat;
}

.plane .links-bg {
  width: 100%;
  height: 100%;
}

.plane > svg {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.plane.rotate90 {
  transform: rotate(90deg);
}
.plane.rotate180 {
  transform: rotate(180deg);
}
.plane.rotate270 {
  transform: rotate(270deg);
}
.plane.rotate90 .links-bg {
  transform: rotate(270deg) translateX(50%) translateY(0);
  transform-origin: bottom;
}
.plane.rotate270 .links-bg {
  transform: rotate(90deg);
  transform-origin: bottom;
}

.plane.rotate180 .links-bg {
  transform: rotate(180deg);
}

.plane.in-hand {
  transform: scale(0.5);
  margin: 125px -250px 0px 0px;
}
</style>
