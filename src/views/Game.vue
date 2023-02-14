<template>
  <div v-if="game._id" id="game" @wheel.prevent="zoomGamePlane">
    <div
      id="gamePlane"
      :style="{ ...gamePlaneCustomStyleData, opacity: 1, transformOrigin: 'top', ...gamePlaneControlStyle }"
    >
      <plane v-for="id in Object.keys(this.game.planeMap)" :key="id" :planeId="id" />
      <bridge v-for="id in Object.keys(this.game.bridgeMap)" :key="id" :bridgeId="id" />

      <div
        v-for="position in possibleAddPlanePositions"
        :key="position.joinPortId + position.joinPortDirect + position.targetPortId + position.targetPortDirect"
        :joinPortId="position.joinPortId"
        :joinPortDirect="position.joinPortDirect"
        :targetPortId="position.targetPortId"
        :targetPortDirect="position.targetPortDirect"
        :style="position.style"
        class="fake-plane"
        v-on:click="addPlane"
      />
    </div>
    <div class="gui" :style="{ zIndex: 1 }">
      <div class="gui" :style="{ left: '50%' }">
        Раунд: {{ game.round }}
        <button :style="currentPlayerIsActive ? {} : { opacity: '0.7' }" v-on:click="endRound">Закончить раунд</button>
        <button v-on:click="leaveGame">Выйти из игры</button>
      </div>
      <div
        class="gui"
        :style="{
          display: 'flex',
          flexFlow: 'column-reverse',
        }"
      >
        <player v-for="id in playerIds" :key="id" :playerId="id" />
      </div>
      <div class="gui" :style="{ top: '100px', right: '0px', left: 'auto', width: '200px' }">
        <div
          v-for="deck in deckList"
          :key="deck._id"
          :style="{ margin: '1px', padding: '10px', border: '1px solid black' }"
        >
          <div v-if="deck._id">
            <button v-if="deck.type === 'domino'" v-on:click="takeDice">Взять кость</button>
            <span v-for="id in Object.keys(deck.itemMap)" :key="id">
              {{ id }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="activeCards._id" class="gui" :style="{ right: '0px', left: 'auto', width: '200px' }">
        <card v-for="id in Object.keys(activeCards.itemMap)" :key="id" :cardId="id" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import {} from '../components/game/utils';

import player from '../components/game/player.vue';
import plane from '../components/game/plane.vue';
import bridge from '../components/game/bridge.vue';
import card from '../components/game/card.vue';

export default {
  components: {
    player,
    plane,
    bridge,
    card,
  },
  data() {
    return {
      gamePlaneScale: 1,
      gamePlaneTranslateX: 0,
      gamePlaneTranslateY: 0,
      gamePlaneRotation: 0,
      gamePlaneConfig: {
        isDragging: false,
        currentX: 0,
        currentY: 0,
        initialX: 0,
        initialY: 0,
        xOffset: 0,
        yOffset: 0,

        isRotating: false,
        initialRotateX: 0,
        currentRotateX: 0,
        xRotateOffset: 0,
        rotation: 0,
        rotationLast: 0,
      },
      gameId: this.$route.params.id,
    };
  },
  computed: {
    ...mapGetters({
      getSimple: 'getSimple',
      currentPlayer: 'currentPlayer',
      currentSession: 'currentSession',
      currentSessionGame: 'currentSessionGame',
      gamePlaneCustomStyleData: 'gamePlaneCustomStyleData',
      availablePorts: 'availablePorts',
    }),
    gamePlaneControlStyle() {
      const transform = [];
      transform.push('translate(' + this.gamePlaneTranslateX + 'px, ' + this.gamePlaneTranslateY + 'px)');
      transform.push(`scale(${this.gamePlaneScale})`);
      transform.push(`rotate(${this.gamePlaneRotation}deg)`);
      return { transform: transform.join(' ') };
    },
    game() {
      return this.$store.state.game?.[this.gameId] || {};
    },
    playerIds() {
      return Object.keys(this.game.playerMap || {});
    },
    activePlayerId() {
      return this.playerIds.find((id) => this.getSimple(id, 'player').active);
    },
    currentPlayerIsActive() {
      return this.currentPlayer === this.activePlayerId;
    },
    deckList() {
      const list = Object.keys(this.game.deckMap).map((id) => this.getSimple(id, 'deck')) || [];
      return list;
    },
    activeCards() {
      return this.deckList.find((deck) => deck.subtype === 'active') || {};
    },
    possibleAddPlanePositions() {
      return this.availablePorts.map(({ joinPortId, joinPortDirect, targetPortId, targetPortDirect, position }) => {
        return {
          joinPortId,
          joinPortDirect,
          targetPortId,
          targetPortDirect,
          style: {
            left: position.left + 'px',
            top: position.top + 'px',
            width: position.right - position.left + 'px',
            height: position.bottom - position.top + 'px',
          },
        };
      });
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
    async takeDice() {
      await api.game.takeDice({ gameId: this.game._id });
    },
    async endRound() {
      await api.game.action({ name: 'endRound' }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
    },
    async leaveGame() {
      await api.game.leaveGame({ gameId: this.game._id });
    },
    async addPlane(event) {
      await api.game
        .action({
          name: 'addPlane',
          data: {
            gameId: this.$route.params.id,
            joinPortId: event.target.attributes.joinPortId.value,
            targetPortId: event.target.attributes.targetPortId.value,
            joinPortDirect: event.target.attributes.joinPortDirect.value,
            targetPortDirect: event.target.attributes.targetPortDirect.value,
          },
        })
        .catch((err) => {
          console.log({ err });
          alert(err.message);
        });
      this.$store.commit('setAvailablePorts', []);
    },
    zoomGamePlane(event) {
      this.gamePlaneScale += event.deltaY > 0 ? -0.1 : 0.1;
    },
  },
  async created() {
    // console.log('async created() {');
  },
  mounted() {
    // console.log('mounted currentSession=', this.currentSession);
    api.game.enter({ gameId: this.gameId }).then((data) => {
      console.log('api.game.enter', data);
      if (data.status != 'ok') {
        localStorage.setItem('currentGame', '');
        this.$router.push({ path: `/` });
      }
    });

    const self = this;
    const config = this.gamePlaneConfig;
    document.body.addEventListener('mousedown', function (event) {
      if (event.target.classList.contains('scroll-off')) return;
      if (event.button === 2) {
        config.initialRotateX = event.clientX;
        config.isRotating = true;
      } else {
        config.initialX = event.clientX - config.xOffset;
        config.initialY = event.clientY - config.yOffset;
        config.isDragging = true;
      }
    });
    document.body.addEventListener('mouseup', function (event) {
      if (event.button === 2) {
        config.rotationLast = config.rotation;
        config.isRotating = false;
      } else {
        config.isDragging = false;
      }
    });
    document.body.addEventListener('mousemove', function (event) {
      if (config.isRotating) {
        config.currentRotateX = event.clientX;
        config.xRotateOffset = config.currentRotateX - config.initialRotateX;
        config.rotation = config.rotationLast + config.xRotateOffset / 2;
        self.gamePlaneRotation = config.rotation;
      }
      if (config.isDragging) {
        config.currentX = event.clientX - config.initialX;
        config.currentY = event.clientY - config.initialY;

        config.xOffset = config.currentX;
        config.yOffset = config.currentY;

        self.gamePlaneTranslateX = config.currentX;
        self.gamePlaneTranslateY = config.currentY;
      }
    });
    document.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });
  },
  async beforeDestroy() {
    console.log('beforeDestroy');
    api.game.exit();
  },
};
</script>

<style>
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
#game .active-event {
  cursor: pointer;
  box-shadow: inset 0 0 20px 8px yellow;
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
/* .port {
  background: yellow;
  position: absolute;
} */
.fake-plane {
  position: absolute;
  background: red;
  border: 1px solid;
  opacity: 0.5;
}
.fake-plane:hover {
  opacity: 0.8;
  z-index: 1;
}
</style>