<template>
  <div id="game">
    <div style="position: absolute; bottom: 0px">{{ this.game }}</div>

    <div id="gamePlane" :style="gamePlaneCustomStyleData">
      <plane
        v-for="plane in planeList"
        :key="plane._id"
        :plane="plane"
      />
      <bridge v-for="bridge in bridgeList" :key="bridge._id" :bridge="bridge" />
    </div>
    <div class="gui">
      <div
        class="gui"
        :style="{
          left: '50%',
        }"
      >
        Раунд: {{ game.round }}
        <button v-on:click="endRound">Закончить раунд</button>
        <button v-on:click="leaveGame">Выйти из игры</button>
      </div>
      <div
        class="gui"
        :style="{
          display: 'flex',
          flexFlow: 'column-reverse',
          width: '50%',
        }"
      >
        {{ playerList }}
        <player
          v-for="player in playerList"
          :key="player._id"
          :player="player"
        />
      </div>
      <div class="gui" :style="{ right: '0px', left: 'auto', width: '200px' }">
        <div
          v-for="deck in game.deckList"
          :key="deck._id"
          :style="{ margin: '1px', padding: '10px', border: '1px solid black' }"
        >
          {{ deck.itemList.length }}
          <span v-for="dice in deck.itemList" :key="dice._id">
            {{ dice._id }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import {} from "../components/game/utils";

import player from "../components/game/player.vue";
import plane from "../components/game/plane.vue";
import bridge from "../components/game/bridge.vue";

export default {
  components: {
    player,
    plane,
    bridge,
  },
  data() {
    return {
      gameId: this.$route.params.id,
    };
  },
  computed: {
    ...mapGetters({
      currentSession: "currentSession",
      currentSessionGame: "currentSessionGame",
      gamePlaneCustomStyleData: "gamePlaneCustomStyleData",
    }),
    game() {
      return this.$store.state.game?.[this.gameId] || {};
    },
    playerList() {
      const currentPlayer = localStorage.getItem("currentPlayer");
      return (
        this.game.playerList?.map((player) => {
          if (player._id === currentPlayer) player.iam = true;
          return player;
        }) || []
      );
    },
    planeList() {
      return this.game.planeList;
    },
    bridgeList() {
      return this.game.bridgeList;
    },
  },
  watch: {
    // 'currentSessionGame': function (val, oldVal) {
    //   console.log("currentSessionGame", val, oldVal);
    //   if(!val) this.$router.push({ name: 'Home' });
    // },
    // 'game.finished': function (val, oldVal) {
    //   console.log("game.finished");
    //   this.$router.push({ path: `/` });
    //   this.$store.commit('setGame', {});
    // }
  },
  methods: {
    ...mapActions({
      getGame: "getGame",
    }),
    async endRound() {
      console.log("endRound");
      await api.game.endRound({ gameId: this.game._id });
    },
    async leaveGame() {
      console.log("leaveGame");
      await api.game.leaveGame({ gameId: this.game._id });
    },
  },
  async created() {
    console.log("async created() {");
  },
  mounted() {
    console.log("mounted currentSession=", this.currentSession);
    api.game.enter({ gameId: this.gameId }).then((data) => {
      console.log("api.game.enter", data);
      if (data.status != "ok") {
        localStorage.setItem("currentGame", "");
        localStorage.setItem("currentPlayer", "");
        this.$router.push({ path: `/` });
      }
    });
  },
  async beforeDestroy() {
    console.log("beforeDestroy");
    api.game.exit();
  },
};
</script>

<style scoped>
#game {
  position: fixed !important;
  height: 100%;
  width: 100%;

  /* background-image: linear-gradient(45deg, blue 25%, transparent 25%),
    linear-gradient(135deg, blue 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, blue 75%),
    linear-gradient(135deg, transparent 75%, blue 75%);
  background-size: 40px 40px;
  background-position: 0 0, 20px 0, 20px -20px, 0px 20px; */
}
#gamePlane {
  position: relative;
  width: 100%;
  height: 100%;
  /* left: 25%;
  top: 25%; */
}
/* #gamePlane {
  transform-origin: 50% 50%;
  transform: scale(0.5);
} */

.gui {
  position: fixed;
  top: 0px;
}

.plane {
  position: absolute;
  transform-origin: 0 0;
}
.port {
  background: yellow;
  position: absolute;
}
</style>