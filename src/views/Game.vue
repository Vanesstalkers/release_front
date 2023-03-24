<template>
  <div
    v-if="game._id"
    id="game"
    :class="[isMobile ? 'mobile-view' : '', isLandscape ? 'landscape-view' : 'portrait-view']"
    @wheel.prevent="zoomGamePlane"
  >
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
    <div
      class="gui exit"
      :style="{
        top: '0px',
        left: '0px',
        fontSize: '2em',
        border: '1px solid black',
        padding: '2px',
        margin: '4px',
      }"
    >
      <font-awesome-icon icon="fa-solid fa-right-from-bracket" v-on:click="leaveGame" />
    </div>

    <div class="gui game-decks">
      <div class="wrapper">
        <div class="game-status-label">{{ statusLabel }}</div>
        <div v-for="deck in deckList" :key="deck._id" class="deck" :code="deck.code">
          <div v-if="deck._id && deck.code === 'Deck[domino]'" class="hat">
            <!-- <button v-on:click="takeDice">
            <font-awesome-icon icon="fa-solid fa-hat-wizard" />
          </button> -->
            {{ Object.keys(deck.itemMap).length }}
          </div>
          <div v-if="deck._id && deck.code === 'Deck[card]'" class="card-event">
            {{ Object.keys(deck.itemMap).length }}
          </div>
          <div v-if="deck._id && deck.code === 'Deck[card_drop]'" class="card-event">
            {{ Object.keys(deck.itemMap).length }}
          </div>
          <div v-if="deck._id && deck.code === 'Deck[card_active]'" class="deck-active">
            <!-- активная карта всегда первая - для верстки она должна стать последней -->
            <card v-for="id in sortActiveCards(Object.keys(deck.itemMap))" :key="id" :cardId="id" :canPlay="true" />
          </div>
        </div>
      </div>
    </div>

    <player :playerId="currentPlayer" :customClass="['gui']" :iam="true" :showControls="showPlayerControls" />
    <div class="gui players">
      <player v-for="(id, index) in playerIds" :key="id" :playerId="id" :customClass="[`idx-${index}`]" :showControls="false" />
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
        isTouchMoved: false,
        currentX: 0,
        currentY: 0,
        initialX: 0,
        initialY: 0,
        distanceX: 0,
        distanceY: 0,
        initialDistance: 0,
        xOffset: 0,
        yOffset: 0,

        isRotating: false,
        initialRotateAngle: 0,
        rotation: 0,
        rotationLast: 0,
      },
      gameId: this.$route.params.id,
    };
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      isMobile: 'isMobile',
      isLandscape: 'isLandscape',
      currentPlayer: 'currentPlayer',
      currentPlayerIsActive: 'currentPlayerIsActive',
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
      return this.getStore(this.gameId, 'game');
    },
    statusLabel() {
      switch (this.game.status) {
        case 'waitForPlayers':
          return 'Ожидание игроков';
        case 'prepareStart':
          return 'Создание игрового поля';
        case 'inProcess':
          return 'Раунд ' + this.game.round;
        case 'finished':
          return 'Игра закончена';
      }
    },
    showPlayerControls() {
      return this.game.status === 'inProcess';
    },
    playerIds() {
      const ids = Object.keys(this.game.playerMap || {}).sort((id1, id2) => (id1 > id2 ? 1 : -1));
      const curPlayerIdx = ids.indexOf(this.currentPlayer);
      return ids.slice(curPlayerIdx + 1).concat(ids.slice(0, curPlayerIdx));
    },
    helper() {
      return this.getStore(this.currentPlayer, 'player')?.helper || {};
    },
    deckList() {
      const list = Object.keys(this.game.deckMap).map((id) => this.getStore(id, 'deck')) || [];
      return list;
    },
    activeCards() {
      return this.deckList.find((deck) => deck.subtype === 'active') || {};
    },
    possibleAddPlanePositions() {
      if (!this.currentPlayerIsActive) return [];
      return (this.game.availablePorts || []).map(
        ({ joinPortId, joinPortDirect, targetPortId, targetPortDirect, position }) => {
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
        },
      );
    },
  },
  watch: {
    'game.round': function () {
      this.$store.commit('setSelectedDiceSideId', null);
      this.$store.commit('setAvailablePorts', []);
    },
    helper: function (val, oldVal) {
      if (val.selector) {
        document.body.setAttribute('tutorial-active', true);
        document.querySelector(val.selector).classList.add('tutorial-active');
      }
    },
    'game.status': function (val) {
      if (val === 'finished') {
        localStorage.setItem('currentGame', '');
        this.$router.push({ path: `/` });
      }
    },
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
    sortActiveCards(arr) {
      return arr
        .map((id) => this.getStore(id, 'card'))
        .sort((a, b) => (a.played > b.played ? 1 : -1)) // сортируем по времени сыгрывания
        .sort((a, b) => (a.played ? 0 : 1)) // переносим не сыгранные в конец
        .map((card) => card._id);
    },
    async takeDice() {
      await api.game.action({ name: 'takeDice', data: { count: 3 } }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
    },
    async takeCard() {
      await api.game.action({ name: 'takeCard', data: { count: 5 } }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
    },
    async leaveGame() {
      await api.game.action({ name: 'leaveGame' }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
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
    this.$store.commit('setSimple', { gameId: this.gameId });
    this.$store.commit('setSimple', { store: {} });
  },
  mounted() {
    api.game
      .enter({ gameId: this.gameId })
      .then((data) => {
        console.log('api.game.enter', data);
      })
      .catch((err) => {
        localStorage.setItem('currentGame', '');
        this.$router.push({ path: `/` });
      });

    document.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });

    const self = this;
    const config = this.gamePlaneConfig;
    document.body.addEventListener('mousedown', function (event) {
      if (event.target.classList.contains('scroll-off') || event.target.classList.contains('gui')) return;
      if (event.button === 2) {
        config.initialRotateAngle = event.clientX;
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
        config.rotation = config.rotationLast + (event.clientX - config.initialRotateAngle) / 2;
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

    document.body.addEventListener('touchstart', function (event) {
      const touches = event.touches;
      if (touches.length === 2) {
        const [touch1, touch2] = touches;
        config.initialDistance = Math.hypot(touch1.pageX - touch2.pageX, touch1.pageY - touch2.pageY);

        config.rotationLast = config.rotation;
        config.initialRotateAngle = Math.atan2(touch2.pageY - touch1.pageY, touch2.pageX - touch1.pageX);
      } else {
        config.initialX = touches[0].pageX;
        config.initialY = touches[0].pageY;
        config.xOffset = self.gamePlaneTranslateX;
        config.yOffset = self.gamePlaneTranslateY;
        config.isTouchMoved = false;
      }
    });
    document.body.addEventListener('touchmove', function (event) {
      const touches = event.touches;
      if (touches.length === 2) {
        const [touch1, touch2] = touches;
        const distance = Math.hypot(touch1.pageX - touch2.pageX, touch1.pageY - touch2.pageY);
        const delta = distance / config.initialDistance;

        const angle = Math.atan2(touch2.pageY - touch1.pageY, touch2.pageX - touch1.pageX);
        config.rotation = config.rotationLast + ((angle - config.initialRotateAngle) * 180) / Math.PI;
        self.gamePlaneRotation = config.rotation;

        // имитируем плавность
        if (delta < 0.5) return;
        else config.initialDistance = distance;
        self.gamePlaneScale += (delta - 1) * 0.5;
      } else {
        config.currentX = event.touches[0].pageX;
        config.currentY = event.touches[0].pageY;
        config.distanceX = config.currentX - config.initialX;
        config.distanceY = config.currentY - config.initialY;

        if (Math.abs(config.distanceX) > 10 || Math.abs(config.distanceY) > 10) {
          config.isTouchMoved = true;
          self.gamePlaneTranslateX = config.distanceX + config.xOffset;
          self.gamePlaneTranslateY = config.distanceY + config.yOffset;
        }
      }
    });
    document.body.addEventListener('touchend', function (event) {
      if (!config.isTouchMoved) {
        // handle tap event on the movable element
        // event.preventDefault();
      } else {
      }
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
  height: 100%;
  width: 100%;
}
#game.mobile-view {
  touch-action: none;
}
#game .active-event {
  cursor: pointer;
  box-shadow: inset 0 0 20px 8px yellow;
}

#gamePlane {
  position: relative;
  width: 100%;
  height: 100%;
}

.gui {
  position: absolute;
  cursor: pointer;
}

.gui .deck > .card-event {
  width: 60px;
  height: 90px;
  color: white;
  border: none;
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.gui.game-decks {
  top: 10px;
  right: 10px;
}
#game.mobile-view .gui.game-decks {
  transform: scale(0.5);
  transform-origin: top right;
}
.gui.game-decks > .wrapper {
}

.gui .deck[code='Deck[domino]'] {
  position: absolute;
  top: 35px;
  right: 100px;
  background: url(../assets/hat.png);
  background-size: cover;
  padding: 20px;
  cursor: default;
}
.gui .deck[code='Deck[domino]'] > .hat {
  color: white;
  font-size: 36px;
  padding: 4px;
  border-radius: 50%;
  box-shadow: inset 0px 0px 20px 0px black;
}

.gui .deck[code='Deck[card]'] {
  position: absolute;
  top: 35px;
  right: 30px;
  cursor: default;
}

.gui .deck[code='Deck[card_drop]'] {
  position: absolute;
  filter: grayscale(1);
  transform: scale(0.5);
  top: 65px;
  right: 0px;
  cursor: default;
}

.deck[code='Deck[card_active]'] {
  position: absolute;
  top: 140px;
  right: 0px;
  display: flex;
}
.deck[code='Deck[card_active]'] .card-event:not(:first-child) {
  margin-top: -135px;
}
.deck-active {
  display: flex;
  flex-direction: column;
}

#game.mobile-view.landscape-view .deck[code='Deck[card_active]'] {
  /* top: 150px;
  left: 0px; */
}

.game-status-label {
  text-align: right;
  color: white;
  font-weight: bold;
  font-size: 2em;
  white-space: nowrap;
  text-shadow: black 1px 0 10px;
}
#game.mobile-view .game-status-label {
  font-size: 1.5em;
}

.gui.players {
  height: auto;
  transform: scale(0.5);
  display: flex;
  flex-direction: column;
  bottom: 10px;
  left: 10px;
  transform-origin: left bottom;
}
#game.mobile-view.portrait-view .gui.players {
  bottom: 160px;
  right: 20px;
  transform-origin: right bottom;
}

.plane {
  position: absolute;
  transform-origin: 0 0;
}
.plane.card-event {
  display: block;
}
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