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
    drawLink({ from = {x: 0, y: 0}, to = {x: 0, y: 0} }) {
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

      diffX = Math.abs(diffX);
      diffY = Math.abs(diffY);
      if(diffX < 4) diffX = 4;
      if(diffY < 4) diffY = 4;
      startX += 2;
      startY += 2;
      endX -= 2;
      endY -= 2;

      const canvas = document.createElement("canvas");
      canvas.width = diffX;
      canvas.height = diffY;
      canvas.style.left = posX + "px";
      canvas.style.top = posY + "px";
      canvas.style.zIndex = 8;
      canvas.style.position = "absolute";
      canvas.style.pointerEvents = "none";
      //canvas.style.border = "1px solid red";

      if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.arc(startX,startY,5,0,Math.PI*2,true);
        ctx.moveTo(endX, endX);
        ctx.arc(endX,endY,5,0,Math.PI*2,true);
        ctx.fill();
      }

      const body = document.getElementsByTagName("body")[0];
      body.appendChild(canvas);
      //console.log(canvas, { posX, startX, endX, posY, startY, endY });
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.sideList.forEach(side => {
        const sideEl = document.getElementById(side.code)
        const sideRect = sideEl.getBoundingClientRect();
        side.links.forEach(link => {
          const linkEl = document.getElementById(link);
          const linkRect = linkEl.getBoundingClientRect();
          this.drawLink({from: {x: sideRect.x, y: sideRect.y}, to: {x: linkRect.x, y: linkRect.y}});
        });
      });
    });
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
