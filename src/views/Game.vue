<template>
  <div
    v-if="game._id"
    id="game"
    :class="[isMobile ? 'mobile-view' : '', isLandscape ? 'landscape-view' : 'portrait-view']"
    @wheel.prevent="zoomGamePlane"
  >
    <tutorial :inGame="true" />

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
      class="game-info"
      :style="{
        position: 'absolute',
        right: '0px',
        top: '0px',
        height: '0px',
        width: '100%',
      }"
    >
      <div
        :class="['gui-resizeable', `scale-${guiScale}`]"
        :style="{
          position: 'absolute',
          right: '10px',
          top: '10px',
          height: 'auto',
          width: 'auto',
          transformOrigin: 'right top',
        }"
      >
        <div class="wrapper">
          <div class="game-status-label">{{ statusLabel }}</div>
          <div v-for="deck in deckList" :key="deck._id" class="deck" :code="deck.code">
            <div v-if="deck._id && deck.code === 'Deck[domino]'" class="hat" v-on:click="takeDice">
              <!-- !!! не забыть убрать takeDice -->
              {{ Object.keys(deck.itemMap).length }}
            </div>
            <div v-if="deck._id && deck.code === 'Deck[card]'" class="card-event" v-on:click="takeCard">
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
    </div>

    <div
      class="session-player"
      :style="{
        position: 'absolute',
        right: '0px',
        bottom: '0px',
        height: '0px',
        width: '100%',
      }"
    >
      <div
        :class="['gui-resizeable', `scale-${guiScale}`]"
        :style="{
          position: 'absolute',
          right: '10px',
          bottom: '10px',
          height: 'auto',
          width: 'auto',
          transformOrigin: 'right bottom',
        }"
      >
        <player
          :playerId="sessionPlayerId"
          :customClass="['gui', `scale-${guiScale}`]"
          :iam="true"
          :showControls="showPlayerControls"
        />
      </div>
    </div>
    <div
      class="players"
      :style="{
        position: 'absolute',
        left: '0px',
        bottom: '0px',
        height: '0px',
        width: '100%',
      }"
    >
      <div
        :class="['gui-resizeable', 'gui-small', `scale-${guiScale}`]"
        :style="
          isMobile && !isLandscape
            ? {
                position: 'absolute',
                right: '10px',
                bottom: 10 + 10 + 180 * 0.6 + `px`,
                height: 'auto',
                width: 'auto',
                transformOrigin: 'right bottom',
              }
            : {
                position: 'absolute',
                left: '10px',
                bottom: '10px',
                height: 'auto',
                width: 'auto',
                transformOrigin: 'left bottom',
              }
        "
      >
        <player
          v-for="(id, index) in playerIds"
          :key="id"
          :playerId="id"
          :customClass="[`idx-${index}`]"
          :showControls="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import {} from '../components/game/utils';

import tutorial from '../components/tutorial/main.vue';
import player from '../components/game/player.vue';
import plane from '../components/game/plane.vue';
import bridge from '../components/game/bridge.vue';
import card from '../components/game/card.vue';

export default {
  components: {
    tutorial,
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
      guiScale: 'guiScale',
      isMobile: 'isMobile',
      isLandscape: 'isLandscape',
      sessionPlayerId: 'sessionPlayerId',
      sessionPlayerIsActive: 'sessionPlayerIsActive',
      gamePlaneCustomStyleData: 'gamePlaneCustomStyleData',
      availablePorts: 'availablePorts',
    }),
    gamePlaneControlStyle() {
      const transform = [];
      transform.push('translate(' + this.gamePlaneTranslateX + 'px, ' + this.gamePlaneTranslateY + 'px)');
      transform.push(`scale(${this.gamePlaneScale * (this.guiScale / 2)})`);
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
      const curPlayerIdx = ids.indexOf(this.sessionPlayerId);
      return ids.slice(curPlayerIdx + 1).concat(ids.slice(0, curPlayerIdx));
    },
    sessionPlayer() {
      return this.getStore(this.playerId, 'player');
    },
    helper() {
      return this.getStore(this.sessionPlayerId, 'player')?.helper || {};
    },
    deckList() {
      const list = Object.keys(this.game.deckMap).map(id => this.getStore(id, 'deck')) || [];
      return list;
    },
    activeCards() {
      return this.deckList.find(deck => deck.subtype === 'active') || {};
    },
    possibleAddPlanePositions() {
      if (!this.sessionPlayerIsActive) return [];
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
    'game.round': function() {
      this.$store.commit('setSelectedDiceSideId', null);
      this.$store.commit('setAvailablePorts', []);
    },
    helper: function(val, oldVal) {
      if (val.selector) {
        document.getElementById('app').setAttribute('tutorial-active', true);
        document.querySelector(val.selector).classList.add('tutorial-active');
      }
    },
    'game.status': function(val) {
      if (val === 'finished') {
        localStorage.setItem('currentGame', '');
        this.$router.push({ path: `/` });
      }
    },
  },
  methods: {
    sortActiveCards(arr) {
      return arr
        .map(id => this.getStore(id, 'card'))
        .sort((a, b) => (a.played > b.played ? 1 : -1)) // сортируем по времени сыгрывания
        .sort((a, b) => (a.played ? 0 : 1)) // переносим не сыгранные в конец
        .map(card => card._id);
    },
    async takeDice() {
      await api.game.action({ name: 'takeDice', data: { count: 3 } }).catch(err => {
        console.log({ err });
        alert(err.message);
      });
    },
    async takeCard() {
      await api.game.action({ name: 'takeCard', data: { count: 5 } }).catch(err => {
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
        .catch(err => {
          console.log({ err });
          alert(err.message);
        });
      this.$store.commit('setAvailablePorts', []);
    },
    zoomGamePlane(event) {
      this.gamePlaneScale += event.deltaY > 0 ? -0.1 : 0.1;
      if (this.gamePlaneScale < 0.3) this.gamePlaneScale = 0.3;
      if (this.gamePlaneScale > 1) this.gamePlaneScale = 1;
    },
  },
  async created() {
    // console.log('async created() {');
    this.$store.commit('setSimple', { gameId: this.gameId });
    this.$store.commit('setSimple', { store: {} });
  },
  mounted() {
    this.gamePlaneScale = this.isMobile ? 0.5 : 1;

    api.game
      .enter({ gameId: this.gameId })
      .then(data => {
        console.log('api.game.enter', data);
      })
      .catch(err => {
        console.log({err});
        localStorage.setItem('currentGame', '');
        this.$router.push({ path: `/` });
      });

    document.addEventListener('contextmenu', function(event) {
      event.preventDefault();
    });

    const self = this;
    const config = this.gamePlaneConfig;
    document.body.addEventListener('mousedown', function(event) {
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
    document.body.addEventListener('mouseup', function(event) {
      if (event.button === 2) {
        config.rotationLast = config.rotation;
        config.isRotating = false;
      } else {
        config.isDragging = false;
      }
    });
    document.body.addEventListener('mousemove', function(event) {
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

    document.body.addEventListener('touchstart', function(event) {
      if (event.target.closest('.helper-dialog')) return;
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
    document.body.addEventListener('touchmove', function(event) {
      if (event.target.closest('.helper-dialog')) return;
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
    document.body.addEventListener('touchend', function(event) {
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
#game.mobile-view #gamePlane {
  margin-left: -50px;
}
#game.mobile-view.landscape-view #gamePlane {
  margin-left: -100px;
}

.gui {
  position: absolute;
  cursor: pointer;
}
.gui-resizeable.scale-1 {
  scale: 0.8;
}
.gui-resizeable.scale-2 {
  scale: 1;
}
.gui-resizeable.scale-3 {
  scale: 1.5;
}
.gui-resizeable.scale-4 {
  scale: 2;
}
.gui-resizeable.scale-5 {
  scale: 2.5;
}
#game.mobile-view .gui-resizeable.scale-1 {
  scale: 0.6;
}
#game.mobile-view .gui-resizeable.scale-2 {
  scale: 0.8;
}
#game.mobile-view .gui-resizeable.scale-3 {
  scale: 1;
}
#game.mobile-view .gui-resizeable.scale-4 {
  scale: 1.2;
}
#game.mobile-view .gui-resizeable.scale-5 {
  scale: 1.5;
}
.gui-resizeable.gui-small.scale-1 {
  scale: 0.6;
}
.gui-resizeable.gui-small.scale-2 {
  scale: 0.8;
}
.gui-resizeable.gui-small.scale-3 {
  scale: 1;
}
.gui-resizeable.gui-small.scale-4 {
  scale: 1.2;
}
.gui-resizeable.gui-small.scale-5 {
  scale: 1.5;
}
#game.mobile-view .gui-resizeable.gui-small.scale-1 {
  scale: 0.4;
}
#game.mobile-view .gui-resizeable.gui-small.scale-2 {
  scale: 0.6;
}
#game.mobile-view .gui-resizeable.gui-small.scale-3 {
  scale: 0.8;
}
#game.mobile-view .gui-resizeable.gui-small.scale-4 {
  scale: 1;
}
#game.mobile-view .gui-resizeable.gui-small.scale-5 {
  scale: 1.2;
}
/* .gui.player.scale-1 > .inner-content {
  transform: scale(0.8);
}
.gui.player.scale-2 > .inner-content {
  transform: scale(1);
}
.gui.player.scale-3 > .inner-content {
  transform: scale(1.5);
}
.gui.player.scale-4 > .inner-content {
  transform: scale(2);
}
.gui.player.scale-5 > .inner-content {
  transform: scale(2.5);
} */

.deck > .card-event {
  width: 60px;
  height: 90px;
  color: white;
  border: none;
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.deck[code='Deck[domino]'] {
  position: absolute;
  top: 35px;
  right: 100px;
  background: url(../assets/hat.png);
  background-size: cover;
  padding: 20px;
  cursor: default;
}
.deck[code='Deck[domino]'] > .hat {
  color: white;
  font-size: 36px;
  padding: 4px;
  border-radius: 50%;
  box-shadow: inset 0px 0px 20px 0px black;
}

.deck[code='Deck[card]'] {
  position: absolute;
  top: 35px;
  right: 30px;
  cursor: default;
}

.deck[code='Deck[card_drop]'] {
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
  display: flex;
  flex-direction: column;
  bottom: 10px;
  left: 10px;
  transform-origin: left bottom;
}
.gui.players.scale-1 {
  transform: scale(0.4);
}
.gui.players.scale-2 {
  transform: scale(0.6);
}
.gui.players.scale-3 {
  transform: scale(0.8);
}
.gui.players.scale-4 {
  transform: scale(1);
}
.gui.players.scale-5 {
  transform: scale(1.2);
}
#game.mobile-view.portrait-view .gui.players {
  bottom: 120px;
  left: auto;
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
.plane.card-event.card-event-req_legal {
  background-image: url(/img/cards/req_legal.jpg);
}
.plane.card-event.card-event-req_tax {
  background-image: url(/img/cards/req_tax.jpg);
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
