<template>
  <div
    :class="['player', player.iam ? 'iam' : '', player.active ? 'active' : '']"
    :style="{
      border: player.iam ? '1px solid green' : 'none',
      width: player.iam ? '100%' : 'auto',
    }"
  >
    <div class="workers">
      <card-worker :card="player" />
    </div>
    <div class="player-hands">
      <div class="hand-planes">
        <plane v-for="plane in planesInHand.itemList" :key="plane._id" :plane="plane" :inHand="true" />
      </div>
      <div class="hand-cards-list">
        <div v-for="deck in cardDecks" :key="deck._id" class="hand-cards">
          <card v-for="card in deck.itemList" :key="card._id" :card="card" />
        </div>
      </div>
      <div class="hand-dices-list">
        <div v-for="deck in dominoDecks" :key="deck._id" class="hand-dices">
          <card v-if="deck.subtype === 'teamlead'" :card="{ name: 'teamlead' }" />
          <card v-if="deck.subtype === 'flowstate'" :card="{ name: 'flowstate' }" />
          <dice v-for="dice in deck.itemList" :key="dice._id" :dice="dice" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import plane from './plane.vue';
import dice from './dice.vue';
import card from './card.vue';
import cardWorker from './cardWorker.vue';

export default {
  components: {
    plane,
    dice,
    card,
    cardWorker,
  },
  props: {
    player: Object,
  },
  computed: {
    dominoDecks() {
      return this.player.deckList.filter((deck) => deck.type === 'domino') || [];
    },
    cardDecks() {
      return this.player.deckList.filter((deck) => deck.type === 'card') || [];
    },
    planesInHand() {
      return this.player.deckList.find((deck) => deck.type === 'plane') || [];
    },
  },
  methods: {},
  mounted() {
    // console.log("player mounted", this.player);
    this.$store.dispatch('setSimple', { [this.player._id]: this.player });
  },
};
</script>

<style scoped>
.player:not(.iam) {
  display: flex;
  flex-flow: wrap;
  transform: scale(0.5);
  transform-origin: top left;
}
.player.iam {
  position: fixed !important;
  left: auto;
  top: auto;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: row-reverse;
}

.workers {
  align-self: flex-start;
}
.player.iam .workers {
  align-self: flex-end;
}

.player-hands {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding: 0px 10px;
  flex-direction: row-reverse;
}
.player.iam .player-hands {
  flex-direction: row;
}
.hand-cards-list {
  width: auto;
}
.hand-cards {
  display: flex;
}

.hand-dices-list {
  width: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.player.iam .hand-dices-list {
  flex-direction: column-reverse;
}
.hand-dices {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
  padding: 0px 0px 10px 0px;
}
.player.iam .hand-dices {
  flex-direction: row-reverse;
  padding: 10px 10px 0px 0px;
}
.hand-dices .domino-dice {
  height: 140px;
  width: 70px;
}

.hand-planes {
  display: flex;
  justify-content: center;
  /* transform: scale(0.5); */
  /* transform-origin: left bottom; */
  max-height: 125px;
}
.player.iam .hand-planes {
  width: 100%;
  /* transform-origin: bottom; */
}
.hand-planes .plane {
  position: relative;
  /* margin: 0px 10px;
  margin-top: -125px; */
}
.player.iam .hand-planes .plane:hover {
  cursor: pointer;
  opacity: 0.7;
}
</style>
