<template>
  <div v-if="player._id" :class="['player', ...customClass, iam ? 'iam' : '', player.active ? 'active' : '']">
    <div class="player-hands">
      <div v-if="planeInHandIds.length" class="hand-planes">
        <plane v-for="id in planeInHandIds" :key="id" :planeId="id" :inHand="true" />
      </div>
      <div v-if="iam" class="hand-cards-list">
        <div v-for="deck in cardDecks" :key="deck._id" class="hand-cards">
          <card v-for="id in Object.keys(deck.itemMap)" :key="id" :cardId="id" :canPlay="iam" />
        </div>
      </div>
      <div class="hand-dices-list">
        <div v-for="deck in dominoDecks" :key="deck._id" class="hand-dices">
          <card v-if="iam && deck.subtype === 'teamlead'" :card="{ name: 'teamlead' }" />
          <card v-if="iam && deck.subtype === 'flowstate'" :card="{ name: 'flowstate' }" />
          <dice v-for="id in Object.keys(deck.itemMap)" :key="id" :diceId="id" :inHand="true" :iam="iam" />
        </div>
      </div>
    </div>
    <div class="workers">
      <card-worker :playerId="playerId" :iam="iam" :showControls="showControls" />
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
    customClass: Array,
    playerId: String,
    iam: Boolean,
    showControls: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      currentPlayer: 'currentPlayer',
      currentPlayerIsActive: 'currentPlayerIsActive',
    }),
    player() {
      return this.getStore(this.playerId, 'player');
    },
    dominoDecks() {
      return this.deckIds.map((id) => this.getStore(id, 'deck')).filter((deck) => deck.type === 'domino') || [];
    },
    cardDecks() {
      return this.deckIds.map((id) => this.getStore(id, 'deck')).filter((deck) => deck.type === 'card') || [];
    },
    deckIds() {
      return Object.keys(this.player.deckMap || {});
    },
    deckCounters() {
      return this.iam
        ? null
        : {
            domino: Object.keys(this.dominoDecks.find((deck) => !deck.subtype)?.itemMap || {}).length || 0,
            card: Object.keys(this.cardDecks.find((deck) => !deck.subtype)?.itemMap || {}).length || 0,
          };
    },
    planeInHandIds() {
      return Object.keys(
        this.deckIds.map((id) => this.getStore(id, 'deck')).find((deck) => deck.type === 'plane')?.itemMap || {},
      );
    },
    showDecks() {
      return this.currentPlayerIsActive && this.player.activeEvent?.showDecks;
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
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  margin-top: 10px;
}
#game.mobile-view.portrait-view .player:not(.iam) {
  flex-direction: row;
}
.player.iam {
  position: absolute !important;
  left: auto;
  top: auto;
  right: 20px;
  bottom: 20px;
  display: flex;
}

#game.mobile-view .player.iam {
  transform: scale(0.7);
  transform-origin: bottom right;
}

.workers {
  z-index: 1; /* карточка воркера должна быть видна при размещении игровых зон из руки */
  align-self: flex-start;
}
.player.iam .workers {
  align-self: flex-end;
}

.player-hands {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  padding: 0px 10px;
  flex-direction: row-reverse;
  position: relative;
  width: 100%;
}
#game.mobile-view.portrait-view .player-hands {
  justify-content: flex-start;
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
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  padding: 0px 0px 10px 0px;
}
.player.iam .hand-dices {
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

.deck-counters {
  position: absolute;
  color: white;
  font-size: 24px;
  width: 100%;
  right: 0px;
  bottom: 0px;
  text-align: right;
}
.deck-counters b {
  font-size: 42px;
}
</style>
