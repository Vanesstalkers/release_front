<template>
  <div id="game">
    <div style="position: absolute; bottom: 0px">{{ this.game }}</div>

    <div id="gamePlane" :style="gamePlaneCustomStyleData">
      <plane
        v-for="plane in planeList"
        :key="plane._id"
        :plane="plane"
        @centerPlaneBackground="centerPlaneBackground"
      />
    </div>
    <div class="gui">
      <div class="gui" :style="{
        left: '50%'
      }">
        Раунд: {{ game.round }}
        <button v-on:click="endRound">Закончить раунд</button>
        <button v-on:click="leaveGame">Выйти из игры</button>
      </div>
      <div class="gui" :style="{
        display: 'flex',
				flexFlow: 'column-reverse',
        width: '50%',
      }">
        {{ playerList }}
        <div
          v-for="player in playerList"
          :key="player._id"
          :class="['player', player.iam ? 'iam': '']"
        >
          <div
            :style="{
              color: player.active ? 'red' : 'blue',
              border: player.iam ? '1px solid green' : 'none',
            }"
          >
            {{ player._id }}
            (
            <div 
              v-for="deck in player.deckList" 
              :key="deck._id"
              class="player-hand"
            >
              <dice v-for="dice in deck.itemList" :key="dice._id" :dice="dice" />
            </div>
            )
          </div>
        
        </div>
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

import plane from "../components/game/plane.vue";
import bridge from "../components/game/bridge.vue";
import dice from "../components/game/dice.vue";

export default {
  components: {
    plane,
    bridge,
    dice,
  },
  data() {
    return {
      gameId: this.$route.params.id,
      gamePlaneCustomStyleData: {},
    };
  },
  computed: {
    ...mapGetters({
      currentSession: "currentSession",
      currentSessionGame: "currentSessionGame",
      getState: "getState",
    }),
    state() {
      return this.$store.state; //this.getState;
    },
    game() {
      return this.$store.state.game?.[this.gameId] || {};
    },
    playerList() {
      //
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
      return this.game.__bridge?.data || [];
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
    centerPlaneBackground() {
      const p = {},
        gamePlane = document.getElementById("gamePlane");
      const gamePlaneRect = gamePlane.getBoundingClientRect();

      gamePlane.querySelectorAll(".plane").forEach((plane) => {
        const _id = plane.getAttribute("_id");
        const rect = plane.getBoundingClientRect();
        const offsetTop = rect.top - gamePlaneRect.top;
        const offsetLeft = rect.left - gamePlaneRect.left;

        if (p.t == undefined || rect.top < p.t) p.t = rect.top;
        if (p.b == undefined || rect.bottom > p.b) p.b = rect.bottom;
        if (p.l == undefined || rect.left < p.l) p.l = rect.left;
        if (p.r == undefined || rect.right > p.r) p.r = rect.right;

        if (p.ot == undefined || offsetTop < p.ot) p.ot = offsetTop;
        if (p.ol == undefined || offsetLeft < p.ol) p.ol = offsetLeft;
      });

      // gamePlane.style.height = (p.b-p.t)+'px';
      // gamePlane.style.width = (p.r-p.l)+'px';
      // gamePlane.style.top = 'calc(50% - '+((p.b-p.t)/2 + p.ot*1)+'px)';
      // gamePlane.style.left = 'calc(50% - '+((p.r-p.l)/2 + p.ol*1)+'px)';

      this.gamePlaneCustomStyleData = {
        height: p.b - p.t + "px",
        width: p.r - p.l + "px",
        top: "calc(50% - " + ((p.b - p.t) / 2 + p.ot * 1) + "px)",
        left: "calc(50% - " + ((p.r - p.l) / 2 + p.ol * 1) + "px)",
      };
    },
  },
  async created() {
    console.log("async created() {");
  },
  mounted() {
    console.log("mounted currentSession=", this.currentSession);
    api.game.enter({ gameId: this.gameId }).then((data) => {
      console.log("api.game.enter", data);
      if (data.status != "ok"){
        localStorage.setItem('currentGame', '');
        localStorage.setItem('currentPlayer', '');
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

.player:not(.iam) {
  flex-flow: column;
  transform: scale(0.5);
  transform-origin: top left;
}
.player.iam {
  position: fixed!important;
  left: auto;
  top: auto;
  right: 20px;
  bottom: 20px;
  flex-direction: row;
}

.player-hand {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
  padding: 5px 15px;
  --position: fixed!important;
  left: 0px;
  bottom: 15px;
}

.player-hand .domino-dice {
  height: 140px;
	width: 70px;
}
</style>