<template>
  <div
    v-if="player._id"
    :class="['player', iam ? 'iam' : '', player.active ? 'active' : '']"
    :style="{
      border: iam ? '1px solid green' : 'none',
    }"
  >
    <div class="workers">
      <card-worker :cardData="player" />
    </div>
    <div class="player-hands">
      <div v-if="planeInHandIds.length" class="hand-planes">
        <plane v-for="id in planeInHandIds" :key="id" :planeId="id" :inHand="true" />
      </div>
      <div class="hand-cards-list">
        <div v-for="deck in cardDecks" :key="deck._id" class="hand-cards">
          <card v-for="id in Object.keys(deck.itemMap)" :key="id" :cardId="id" />
        </div>
      </div>
      <div class="hand-dices-list">
        <div v-for="deck in dominoDecks" :key="deck._id" class="hand-dices">
          <card v-if="deck.subtype === 'teamlead'" :card="{ name: 'teamlead' }" />
          <card v-if="deck.subtype === 'flowstate'" :card="{ name: 'flowstate' }" />
          <dice v-for="id in Object.keys(deck.itemMap)" :key="id" :diceId="id" :moveable="iam" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
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
    playerId: String,
  },
  computed: {
    ...mapGetters({
      getSimple: 'getSimple',
      currentPlayer: 'currentPlayer',
    }),
    player() {
      return this.getSimple(this.playerId, 'player');
    },
    iam() {
      return this.playerId === this.currentPlayer;
    },
    dominoDecks() {
      return this.deckIds.map((id) => this.getSimple(id, 'deck')).filter((deck) => deck.type === 'domino') || [];
    },
    cardDecks() {
      return this.deckIds.map((id) => this.getSimple(id, 'deck')).filter((deck) => deck.type === 'card') || [];
    },
    deckIds() {
      return Object.keys(this.player.deckMap || {});
    },
    planeInHandIds() {
      return Object.keys(
        this.deckIds.map((id) => this.getSimple(id, 'deck')).find((deck) => deck.type === 'plane')?.itemMap || {},
      );
    },
  },
  methods: {},
  mounted() {
    // console.log("player mounted", this.player);
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
  position: relative;
  width: 100%;
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
  position: fixed;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  background: black;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
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
