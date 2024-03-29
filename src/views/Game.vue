<template>
  <div
    v-if="game._id"
    id="game"
    :class="[isMobile ? 'mobile-view' : '', isLandscape ? 'landscape-view' : 'portrait-view']"
    @wheel.prevent="zoomGamePlane"
  >
    <tutorial :inGame="true" />

    <GUIWrapper
      :pos="['top', 'left']"
      :offset="{ left: isMobile ? 60 : [60, 80, 110, 130, 160, 190][guiScale] }"
      :contentClass="['gui-small']"
      :wrapperStyle="{ zIndex: 1 }"
    >
      <div style="display: flex;">
        <div class="chat gui-btn" />
        <div class="log gui-btn" v-on:click="showLog = !showLog" />
        <div class="move gui-btn" v-on:click="showControls = !showControls" />
      </div>
      <div v-if="showControls" class="gameplane-controls">
        <div class="zoom-minus" v-on:click="zoomGamePlane({ deltaY: 1 })" />
        <div class="move-top" v-on:click="gamePlaneTranslateY -= 100" />
        <div class="zoom-plus" v-on:click="zoomGamePlane({ deltaY: -1 })" />
        <div class="move-left" v-on:click="gamePlaneTranslateX -= 100" />
        <div
          class="reset"
          v-on:click="
            gamePlaneRotation = 0;
            gamePlaneTranslateX = 0;
            gamePlaneTranslateY = 0;
            updatePlaneScale();
          "
        />
        <div class="move-right" v-on:click="gamePlaneTranslateX += 100" />
        <div class="rotate-right" v-on:click="gamePlaneRotation += 15" />
        <div class="move-bottom" v-on:click="gamePlaneTranslateY += 100" />
        <div class="rotate-left" v-on:click="gamePlaneRotation -= 15" />
      </div>
    </GUIWrapper>

    <div v-if="showLog" class="log-content">
      <div v-for="[id, logItem] in Object.entries(logs).reverse()" :key="id" class="log-item">
        [ {{ new Date(logItem.time).toTimeString().split(' ')[0] }} ]:
        {{ logItem.msg }}
      </div>
    </div>

    <div v-if="shownCard" class="shown-card">
      <div class="close" v-on:click.stop="closeCardInfo" />
      <div class="img" :style="{ backgroundImage: `url(/img/cards/release/${shownCard}.jpg)` }" />
    </div>

    <div
      id="gamePlane"
      :style="{ ...gamePlaneCustomStyleData, opacity: 1, transformOrigin: 'left top', ...gamePlaneControlStyle }"
    >
      <plane v-for="id in Object.keys(this.game.planeMap)" :key="id" :planeId="id" :gamePlaneScale="gamePlaneScale" />
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

    <GUIWrapper :pos="['top', 'right']" :wrapperClass="['game-info']">
      <div class="wrapper">
        <div class="game-status-label">{{ statusLabel }}</div>
        <div v-for="deck in deckList" :key="deck._id" class="deck" :code="deck.code">
          <div v-if="deck._id && deck.code === 'Deck[domino]'" class="hat" v-on:click="takeDice">
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
    </GUIWrapper>

    <GUIWrapper :pos="['bottom', 'right']" :wrapperClass="['session-player']">
      <player
        :playerId="sessionPlayerId"
        :customClass="[`scale-${guiScale}`]"
        :iam="true"
        :showControls="showPlayerControls"
      />
    </GUIWrapper>
    <GUIWrapper
      :pos="isMobile && isPortrait ? ['bottom', 'right'] : ['bottom', 'left']"
      :offset="isMobile && isPortrait ? { bottom: 10 + 10 + 180 * 0.6 } : {}"
      :wrapperClass="['players']"
      :contentClass="['gui-small']"
    >
      <player
        v-for="(id, index) in playerIds"
        :key="id"
        :playerId="id"
        :customClass="[`idx-${index}`]"
        :showControls="false"
      />
    </GUIWrapper>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import {} from '../components/game/utils';

import GUIWrapper from '../components/gui-wrapper.vue';
import tutorial from '../components/tutorial/main.vue';
import player from '../components/game/player.vue';
import plane from '../components/game/plane.vue';
import bridge from '../components/game/bridge.vue';
import card from '../components/game/card.vue';

export default {
  components: {
    GUIWrapper,
    tutorial,
    player,
    plane,
    bridge,
    card,
  },
  data() {
    return {
      gamePlaneScale: 1,
      gamePlaneScaleMin: 0.3,
      gamePlaneScaleMax: 1,
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
      showLog: false,
      showControls: false,
      gameId: this.$route.params.id,
    };
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      guiScale: 'guiScale',
      isMobile: 'isMobile',
      isLandscape: 'isLandscape',
      isPortrait: 'isPortrait',
      sessionPlayerId: 'sessionPlayerId',
      sessionPlayerIsActive: 'sessionPlayerIsActive',
      gamePlaneCustomStyleData: 'gamePlaneCustomStyleData',
      availablePorts: 'availablePorts',
      shownCard: 'shownCard',
    }),
    gamePlaneControlStyle() {
      const transform = [];
      transform.push('translate(' + this.gamePlaneTranslateX + 'px, ' + this.gamePlaneTranslateY + 'px)');
      transform.push(`rotate(${this.gamePlaneRotation}deg)`);
      return { transform: transform.join(' '), scale: this.gamePlaneScale };
    },
    game() {
      return this.getStore(this.gameId, 'game');
    },
    logs() {
      const data = this.getStore('logs');
      return data;
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
    isLandscape: function() {
      this.updatePlaneScale();
    },
    'game.availablePorts': function(newValue, oldValue) {
      if (newValue?.length > 0 || oldValue?.length > 0) this.updatePlaneScale();
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
      // return;
      await api.game.action({ name: 'takeDice', data: { count: 3 } }).catch(err => {
        prettyAlert(err.message);
      });
    },
    async takeCard() {
      // return;
      await api.game.action({ name: 'takeCard', data: { count: 5 } }).catch(err => {
        prettyAlert(err.message);
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
          prettyAlert(err.message);
        });
      this.$store.commit('setAvailablePorts', []);
    },
    updatePlaneScale() {
      if (this.$el instanceof HTMLElement) {
        const { innerWidth, innerHeight } = window;

        const gamePlaneRotation = this.gamePlaneRotation;
        const gamePlaneTranslateX = this.gamePlaneTranslateX;
        const gamePlaneTranslateY = this.gamePlaneTranslateY;
        this.gamePlaneRotation = 0;
        this.gamePlaneTranslateX = 0;
        this.gamePlaneTranslateY = 0;
        const restoreGamePlaneSettings = () => {
          this.gamePlaneRotation = gamePlaneRotation;
          this.gamePlaneTranslateX = gamePlaneTranslateX;
          this.gamePlaneTranslateY = gamePlaneTranslateY;
        };

        let { width, height } = this.$el.querySelector('#gamePlane').getBoundingClientRect();
        width = width / this.gamePlaneScale;
        height = height / this.gamePlaneScale;
        const value = Math.min(innerWidth / width, innerHeight / height);
        if (value > 0) {
          this.gamePlaneScale = value * 0.75;
          if (this.gamePlaneScaleMin > value) this.gamePlaneScaleMin = value;
          if (this.gamePlaneScaleMax < value) this.gamePlaneScaleMax = value;
          this.$nextTick(() => {
            const p = {};
            const gamePlane = document.getElementById('gamePlane');
            if (gamePlane instanceof HTMLElement) {
              const gamePlaneRect = gamePlane.getBoundingClientRect();

              gamePlane.querySelectorAll('.plane, .fake-plane').forEach(plane => {
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

              const planePadding = 300;
              const gamePlaneCustomStyleData = {
                height: planePadding + (p.b - p.t) / this.gamePlaneScale + 'px',
                width: planePadding + (p.r - p.l) / this.gamePlaneScale + 'px',
                top: 'calc(50% - ' + ((p.b - p.t) / 2 + p.ot * 1) + 'px)',
                left: `calc(${this.isMobile ? '65%' : '50%'} - ${(p.r - p.l) / 2 + p.ol * 1}px)`,
              };
              this.$store.dispatch('setSimple', { gamePlaneCustomStyleData });

              restoreGamePlaneSettings();
            }
          });
        }
      }
    },

    zoomGamePlane(event) {
      this.gamePlaneScale += event.deltaY > 0 ? -0.1 : 0.1;
      if (this.gamePlaneScale < this.gamePlaneScaleMin) this.gamePlaneScale = this.gamePlaneScaleMin;
      if (this.gamePlaneScale > this.gamePlaneScaleMax) this.gamePlaneScale = this.gamePlaneScaleMax;
    },
    closeCardInfo() {
      this.$store.commit('setShownCard', null);
    },
  },
  async created() {
    // console.log('async created() {');
    this.$store.commit('setSimple', { gameId: this.gameId });
    // this.$store.commit('setSimple', { store: {} });
  },
  mounted() {
    api.game
      .enter({ gameId: this.gameId })
      .then(data => {
        console.log('api.game.enter', data);
      })
      .catch(err => {
        console.log({ err });
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
  background-image: url(/img/cards/release/req_legal.jpg);
}
.plane.card-event.card-event-req_tax {
  background-image: url(/img/cards/release/req_tax.jpg);
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
.shown-card {
  position: fixed !important;
  z-index: 9999;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-image: url(../assets/clear-grey-back.png);
}
.shown-card > .img {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
}
.shown-card > .close {
  background-image: url(../assets/close.png);
  background-color: black;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  border-radius: 10px;
}
.shown-card > .close:hover {
  opacity: 0.7;
}

.gameplane-controls {
  height: 200px;
  width: 200px;
  margin: 20px;
  padding: 5px;
  border: 8px solid #f4e205;
  border-radius: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.gameplane-controls > div {
  width: 30%;
  height: 30%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
  background-color: #f4e205;
  box-shadow: 5px 5px 5px 0px #a69900;
  border-radius: 50%;
  cursor: pointer;
}
.gameplane-controls > div:hover {
  opacity: 0.5;
}
.gameplane-controls > .move-top {
  background-image: url(../assets/arrow-top.png);
}
.gameplane-controls > .move-bottom {
  background-image: url(../assets/arrow-bottom.png);
}
.gameplane-controls > .move-right {
  background-image: url(../assets/arrow-right.png);
}
.gameplane-controls > .move-left {
  background-image: url(../assets/arrow-left.png);
}
.gameplane-controls > .zoom-plus {
  background-image: url(../assets/zoom+.png);
}
.gameplane-controls > .zoom-minus {
  background-image: url(../assets/zoom-.png);
}
.gameplane-controls > .rotate-left {
  background-image: url(../assets/rotate-left.png);
}
.gameplane-controls > .rotate-right {
  background-image: url(../assets/rotate-right.png);
}
.gameplane-controls > .reset {
  background-color: grey;
  box-shadow: 5px 5px 5px 0px darkgrey;
  background-image: url(../assets/reset.png);
}

.gui-btn {
  width: 64px;
  height: 64px;
  border: 4px solid #f4e205;
  border-radius: 50%;
  background-color: #f4e205;
  background-size: 50px;
  background-repeat: no-repeat;
  background-position: center;
  margin: 10px;
  cursor: pointer;
}
.gui-btn:hover {
  opacity: 0.7;
}
.gui-btn.chat {
  background-image: url(../assets/chat.png);
}
.gui-btn.log {
  background-image: url(../assets/log.png);
}
.gui-btn.move {
  background-image: url(../assets/move.png);
}

.log-content {
  position: fixed;
  left: 40px;
  top: 60px;
  z-index: 1;
  width: calc(100% - 100px);
  height: calc(100% - 100px);
  margin: 30px;
  box-shadow: inset 0px 0px 2px 2px #f4e205;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAACFklEQVR4nO3TMREAIRDAwAP/0l7UG2DSQrGrIE3WzHwDHO3bAfAyg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAgEg0AwCASDQDAIBINAMAiEHzg6AlzqD8bjAAAAAElFTkSuQmCCCg==);
  color: #f4e205;
  overflow: auto;
  text-align: left;
}
.log-item {
  padding: 10px;
}
</style>
