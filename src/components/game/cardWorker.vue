<template>
  <div
    v-if="player._id"
    :id="player._id"
    :class="[
      'card-worker',
      'card-worker-' + player.code,
      player.active ? 'active' : '',
      choiceEnabled ? 'active-event' : '',
    ]"
    :style="customStyle"
  >
    <div v-if="iam && currentPlayerIsActive" v-on:click="endRound" class="end-round-btn">Закончить раунд</div>
    <div v-if="player.active && this.localTimer !== null" class="end-round-timer">{{ this.localTimer }}</div>
    <div v-if="!iam" class="card-event">
      {{ Object.keys(cardDeckCount).length }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  props: {
    playerId: String,
    iam: Boolean,
  },
  data() {
    return {
      localTimer: null,
      localTimerUpdateTime: null,
      localTimerId: null,
    };
  },
  watch: {
    player: function () {
      if (this.localTimerUpdateTime !== this.player.timerUpdateTime) {
        clearTimeout(this.localTimerId);
        this.localTimer = this.player.timer;
        this.localTimerUpdateTime = this.player.timerUpdateTime;
        this.localTimerId = setInterval(() => {
          if (this.localTimer !== null) this.localTimer--;
        }, 1000);
      }
    },
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      currentPlayerIsActive: 'currentPlayerIsActive',
    }),
    player() {
      return this.getStore(this.playerId, 'player') || {};
    },
    customStyle() {
      const style = {};
      // style.backgroundImage = `url(../../assets/cards/${this.card.name||'unknown'}.jpg)`;
      // style.backgroundImage = `url(../../assets/plane.png)`;
      return style;
    },
    choiceEnabled() {
      return this.currentPlayerIsActive && this.player.activeEvent?.choiceEnabled;
    },
    cardDeckCount() {
      return (
        Object.keys(
          Object.keys(this.player.deckMap || {})
            .map((id) => this.getStore(id, 'deck'))
            .filter((deck) => deck.type === 'card' && !deck.subtype)[0]?.itemMap || {},
        ).length || 0
      );
    },
  },
  methods: {
    async endRound() {
      await api.game.action({ name: 'endRound' }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
    },
  },
  mounted() {},
};
</script>

<style scoped>
.card-worker {
  position: relative;
  border: 1px solid;
  width: 120px;
  height: 180px;
  background-size: cover;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  border-radius: 10px;
  margin: 0px 0px 0px 5px;
  box-shadow: inset 0px 20px 20px 0px black;

  background-image: url(../../assets/workers/1.jpg);
}
.card-worker-1 {
  background-image: url(../../assets/workers/1.jpg);
}
.card-worker-2 {
  background-image: url(../../assets/workers/2.jpg);
}
.card-worker-3 {
  background-image: url(../../assets/workers/3.jpg);
}
.card-worker-4 {
  background-image: url(../../assets/workers/4.jpg);
}
.card-worker-5 {
  background-image: url(../../assets/workers/5.jpg);
}
.card-worker.active {
  outline: 4px solid green;
}

.card-worker .card-event {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 60px;
  height: 90px;
  color: white;
  border: none;
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-content: center;
}
#game.mobile-view.portrait-view .card-worker .card-event {
  left: auto;
  right: 0px;
}

.card-worker.active-event .end-round-btn,
.card-worker.active-event .end-round-timer {
  display: none;
}

.end-round-btn {
  position: absolute;
  bottom: 0px;
  width: 100px;
  font-size: 0.5em;
  border: 1px solid black;
  text-align: center;
  cursor: pointer;
  margin: 6px 10px;
  background: #3f51b5;
  color: white;
  font-size: 16px;
}
.end-round-timer {
  position: absolute;
  bottom: 50px;
  width: 100px;
  z-index: 1;
  font-size: 40px;
  color: white;
  border-radius: 50%;
  height: 100px;
  line-height: 100px;
  margin: 10px;
  box-shadow: inset 0 0 20px 20px #3f51b5;
  transition: box-shadow 0.5s ease-in-out;
}
</style>
