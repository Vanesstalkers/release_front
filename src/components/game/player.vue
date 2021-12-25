<template>
  <div
    :class="['player', player.iam ? 'iam' : '', player.active ? 'active': '']"
    :style="{
      color: player.active ? 'red' : 'blue',
      border: player.iam ? '1px solid green' : 'none',
      width: player.iam ? '100%' : 'auto',
    }"
  >
    (
    <div
      class="player-hand"
      :style="{
        display: 'flex',
        flexWrap: 'wrap',
      }"
    >
      <div class="hand-planes">
        <plane
          v-for="plane in planesInHand.itemList"
          :key="plane._id"
          :plane="plane"
        />
      </div>
      <div class="hand-dices">
        <dice
          v-for="dice in dicesInHand.itemList"
          :key="dice._id"
          :dice="dice"
        />
      </div>
      )
    </div>
  </div>
</template>

<script>
import plane from "./plane.vue";
import dice from "./dice.vue";

export default {
  components: {
    plane,
    dice,
  },
  props: {
    player: Object,
  },
  computed: {
    dicesInHand() {
      return this.player.deckList.find((deck) => deck.type === "domino") || [];
    },
    planesInHand() {
      return this.player.deckList.find((deck) => deck.type === "plane") || [];
    },
  },
  methods: {},
  mounted() {
    console.log("player mounted", this.player);
    this.$store.dispatch("setSimple", { [this.player._id]: this.player });
  },
};
</script>

<style scoped>
.player:not(.iam) {
  flex-flow: column;
  transform: scale(0.5);
  transform-origin: top left;
}
.player.iam {
  position: fixed !important;
  left: auto;
  top: auto;
  right: 20px;
  bottom: 20px;
  flex-direction: row;
}

.hand-dices {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
  padding: 5px 15px;
  --position: fixed !important;
  left: 0px;
  bottom: 15px;
}
.hand-dices .domino-dice {
  height: 140px;
  width: 70px;
}

.hand-planes {
  width: 100%;
  display: flex;
  justify-content: center;
  transform: scale(0.5);
	transform-origin: bottom;
	max-height: 125px;
}
.hand-planes .plane {
  position: relative;
  margin: 0px 10px;
  margin-top: -125px;
}
.hand-planes .plane:hover {
  cursor: pointer;
  opacity: 0.7;
}
</style>
