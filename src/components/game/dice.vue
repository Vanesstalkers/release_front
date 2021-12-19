<template>
  <div
    class="domino-dice"
    v-on:click.stop="pickDice"
  >
    <div class="controls">
      <div class="control" v-on:click.stop="pickDice">move</div>
      <div class="control rotate" v-on:click.stop="rotateDice">rotate</div>
      <div class="control fake" v-on:click.stop>disabled rotate</div>
      <div class="control" v-on:click.stop="deleteDice">delete</div>
    </div>
    <div
      v-for="side in sideList"
      :key="side._id"
      :value="side.value"
      class="el"
    />
  </div>
</template>

<script>
export default {
  props: {
    dice: Object,
  },
  computed: {
    sideList() {
      return this.dice.sideList || [{}, {}];
    },
  },
  methods: {
    pickDice() {
      const diceId = this.dice._id;
      this.$store.commit("setPickedDiceId", diceId);
      api.game.getZonesAvailability({ gameId: this.$route.params.id, diceId });
    },
    rotateDice() {
      console.log("rotateDice _id=", this.dice._id);
      api.game.rotateDice({ gameId: this.$route.params.id, diceId: this.dice._id });
    },
    deleteDice() {
      console.log("deleteDice _id=", this.dice._id);
    },
  },
  mounted() {},
};
</script>

<style scoped>
.domino-dice {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  cursor: pointer;
}
.domino-dice > .controls {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background: darkgrey;
  opacity: 0.9;
  color: white;
}
.zone.vertical .domino-dice > .controls {
  flex-wrap: wrap;
}
.zone.vertical .domino-dice > .controls > .control {
  height: 33.333%;
}

.plane .domino-dice:hover > .controls,
.bridge .domino-dice:hover > .controls {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.domino-dice > .controls > .control {
  width: 100%;
  height: 100%;
}
.domino-dice > .controls > .control:not(.fake):hover {
  cursor: pointer;
  background: grey;
}

.domino-dice > .controls > .control.fake {
  display: none;
}
.bridge .domino-dice > .controls > .control.fake {
  display: block;
  cursor: not-allowed;
  background: lightgray;
}
.bridge .domino-dice > .controls > .control.rotate {
  display: none;
}


.domino-dice > .el {
  flex-shrink: 0;
  float: left;
  width: 70px;
  height: 70px;
  background-image: url(../../assets/Dices.png);
  cursor: pointer;
}
.domino-dice > .el {
  background-position: -497px;
}
.domino-dice > .el[value="0"] {
  background-position: -0px;
}
.domino-dice > .el[value="1"] {
  background-position: -71px;
}
.domino-dice > .el[value="2"] {
  background-position: -142px;
}
.domino-dice > .el[value="3"] {
  background-position: -213px;
}
.domino-dice > .el[value="4"] {
  background-position: -284px;
}
.domino-dice > .el[value="5"] {
  background-position: -355px;
}
.domino-dice > .el[value="6"] {
  background-position: -426px;
}
</style>
