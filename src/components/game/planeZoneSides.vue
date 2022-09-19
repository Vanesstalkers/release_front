<template>
  <div class="sideList">
    <div
      v-for="(side, index) in sideList"
      :key="side._id"
      :index="index"
      :id="side.code"
      :class="['side' + index]"
    />
  </div>
</template>

<script>
export default {
  props: {
    sideList: Array,
  },
  methods: {
    drawLink({ from = { x: 0, y: 0 }, to = { x: 0, y: 0 } }, container) {
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
      // startX += 2;
      // startY += 2;
      // endX -= 2;
      // endY -= 2;

      const canvas = document.createElement("canvas");
      canvas.width = diffX + 16;
      canvas.height = diffY + 16;
      canvas.style.left = (posX - 6) + "px";
      canvas.style.top = (posY - 6) + "px";
      canvas.style.zIndex = 0;
      canvas.style.position = "absolute";
      canvas.style.pointerEvents = "none";

      if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        // ctx.globalAlpha = 0.5;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "yellow";
        for (let i = 0; i <= 16; (i = i + 8)) {
          ctx.beginPath();
          if (diffX > diffY) {
            ctx.moveTo(startX + i/4 + 2, startY + i + 2);
            ctx.lineTo(endX + i/4 + 2, endY + i + 2);
          }else{
            ctx.moveTo(startX + i + 2, startY + i/4 + 2);
            ctx.lineTo(endX + i + 2, endY + i/4 + 2);
          }
          ctx.closePath();
          ctx.stroke();
        }
        ctx.fill();

        // ctx.fillStyle = "green";
        // ctx.beginPath();
        // ctx.moveTo(startX, startY);
        // ctx.arc(startX,startY,5,0,Math.PI*2,true);
        // ctx.moveTo(endX, endX);
        // ctx.arc(endX,endY,5,0,Math.PI*2,true);
      }

      container.appendChild(canvas);
      //console.log(canvas, { posX, startX, endX, posY, startY, endY });
    },
  },
  mounted() {
    setTimeout(() => {
      this.sideList.forEach((side) => {
        const sideEl = document.getElementById(side.code);
        const sideRect = sideEl.getBoundingClientRect();
        const planeEl = sideEl.closest(".plane");
        console.log({ planeEl, rect: planeEl.getBoundingClientRect() });
        side.links.forEach((link) => {
          const linkEl = document.getElementById(link);
          const linkRect = linkEl.getBoundingClientRect();
          this.drawLink(
            {
              from: { x: sideRect.x, y: sideRect.y },
              to: { x: linkRect.x, y: linkRect.y },
            },
            planeEl
          );
        });
      });
    }, 300);
  },
};
</script>

<style scoped>
.sideList {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: 'none';
}
.sideList > * {
  position: absolute;
}
.sideList > .side0 {
  top: 50%;
  left: 25%;
}
.sideList > .side1 {
  top: 50%;
  left: 75%;
}
.vertical .sideList > .side0 {
  top: 25%;
  left: 50%;
}
.vertical .sideList > .side1 {
  top: 75%;
  left: 50%;
}
</style>
