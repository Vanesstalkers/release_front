<template>
  <div
    class="domino-dice"
    v-on:click="pickDice"
    :code="dice.storageCode"
    :_id="dice._id"
  >
    <div class='el' :value="dice.side1" />
    <div class='el' :value="dice.side2" />
  </div>

</template>

<script>
export default {
  props: {
    dice: Object,
  },
  methods: {
    pickDice (event) {
      const parent = event.target.parentNode;
      const parentCode = parent.attributes._id.value;
      this.$store.commit("setPickedDice", parentCode);
    },
  },
  mounted() {
  }
}
</script>

<style scoped>
  .domino-dice {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    cursor: pointer;
  }
  .domino-dice:hover {
    opacity: 0.7;
  }
  .domino-dice > .el {
    flex-shrink: 0;
    float: left;
    width: 70px;
    height: 70px;
    background-image: url(../../assets/Dices.png);
    cursor: pointer;
  }
  .domino-dice > .el { background-position: -497px }
  .domino-dice > .el[value="0"] { background-position: -0px }
  .domino-dice > .el[value="1"] { background-position: -71px }
  .domino-dice > .el[value="2"] { background-position: -142px }
  .domino-dice > .el[value="3"] { background-position: -213px }
  .domino-dice > .el[value="4"] { background-position: -284px }
  .domino-dice > .el[value="5"] { background-position: -355px }
  .domino-dice > .el[value="6"] { background-position: -426px }
</style>
