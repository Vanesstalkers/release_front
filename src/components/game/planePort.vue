<template>
  <div
    class="port"
    :id="port.code"
    :style="{ left: port.left + 'px', top: port.top + 'px', opacity: port.linkedBridge ? 0 : 1 }"
  />
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  props: {
    port: Object,
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    drawLink({ from = { x: 0, y: 0 }, to = { x: 0, y: 0 } }, container) {
      // console.log({ from, to });
      const containerRect = container.getBoundingClientRect();
      let diffX = to.x - from.x;
      let diffY = to.y - from.y;
      let posX = from.x,
        posY = from.y,
        startX = 0,
        startY = 0,
        endX = diffX,
        endY = diffY;
      if (diffX < 0) {
        posX = to.x;
        startX = Math.abs(diffX);
        endX = 0;
      }
      if (diffY < 0) {
        posY = to.y;
        startY = Math.abs(diffY);
        endY = 0;
      }
      posX -= containerRect.x;
      posY -= containerRect.y;

      diffX = Math.abs(diffX);
      diffY = Math.abs(diffY);
      if (diffX < 4) diffX = 4;
      if (diffY < 4) diffY = 4;
      // startX += 4;
      // startY += 4;
      // endX -= 4;
      // endY -= 4;

      const canvas = document.createElement('canvas');
      canvas.width = diffX + 16;
      canvas.height = diffY + 16;
      canvas.style.left = posX - 6 + 'px';
      canvas.style.top = posY - 6 + 'px';
      canvas.style.zIndex = 0;
      canvas.style.position = 'absolute';
      canvas.style.pointerEvents = 'none';
      //canvas.style.border = "1px solid red";

      if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        // ctx.globalAlpha = 0.5;
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'yellow';
        for (let i = 0; i <= 16; i = i + 8) {
          ctx.beginPath();
          if (diffX > diffY) {
            ctx.moveTo(startX + i / 4 + 2, startY + i + 2);
            ctx.lineTo(endX + i / 4 + 2, endY + i + 2);
          } else {
            ctx.moveTo(startX + i + 2, startY + i / 4 + 2);
            ctx.lineTo(endX + i + 2, endY + i / 4 + 2);
          }
          ctx.closePath();
          ctx.stroke();
        }
        ctx.fill();

        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        // ctx.arc(startX,startY,5,0,Math.PI*2,true);
        ctx.moveTo(endX, endX);
        // ctx.arc(endX,endY,5,0,Math.PI*2,true);
        ctx.fill();
      }

      // const body = document.getElementsByTagName("body")[0];
      container.appendChild(canvas);
      //console.log(canvas, { posX, startX, endX, posY, startY, endY });
    },
  },
  mounted() {
    // console.log('planePort mounted', this.port);
    if (!this.port.linkedBridge) {
      const portEl = document.getElementById(this.port.code);
      const portRect = portEl.getBoundingClientRect();
      let planeEl = portEl.closest('.plane');
      for (const link of Object.keys(this.port.links)) {
        const linkEl = document.getElementById(link);
        const linkRect = linkEl.getBoundingClientRect();
        if (!planeEl) planeEl = linkEl.closest('.plane');
        this.drawLink(
          {
            from: { x: portRect.x + 37.5, y: portRect.y + 37.5 },
            to: { x: linkRect.x, y: linkRect.y },
          },
          planeEl.querySelector('.links-bg'),
        );
      }
    }
    this.$store.dispatch('setSimple', { [this.port._id]: this.port });
  },
};
</script>

<style scoped>
.port {
  position: absolute;
  height: 75px;
  width: 75px;
  --border: 1px solid yellow;
  background-image: url(../../assets/clear-black-back.png);
  background-size: 75px;
  background-position: center;
  background-repeat: no-repeat;
  background: black;
  opacity: 1;
}
.port::after {
  content: '';
  background-image: url(../../assets/portIcon.png);
  width: 100%;
  height: 100%;
  background-size: 30px;
  background-position: center;
  background-repeat: no-repeat;
  display: block;
  opacity: 0.5;
}
</style>
