<template>
  <div
    v-if="dice._id"
    :code="dice.code"
    :class="[
      'domino-dice',
      dice.deleted ? 'deleted' : '',
      locked ? 'locked' : '',
      activeEvent ? 'active-event' : '',
      hide ? 'hide' : '',
    ]"
    v-on:click.stop="(e) => (activeEvent ? chooseDice() : pickDice())"
  >
    <div v-if="!locked" class="controls">
      <div class="scroll-off control" v-on:click.stop="pickDice">move</div>
      <div class="scroll-off control rotate" v-on:click.stop="rotateDice">rotate</div>
      <div class="scroll-off control fake-rotate disabled" v-on:click.stop>disabled rotate</div>
      <div :class="['scroll-off', 'control', 'disabled', replaceAllowed ? 'hidden' : '']">disabled delete</div>
      <div
        :class="['scroll-off', 'control', replaceAllowed && !dice.deleted ? '' : 'hidden']"
        v-on:click.stop="deleteDice"
      >
        delete
      </div>
      <div
        :class="['scroll-off', 'control', replaceAllowed && dice.deleted ? '' : 'hidden']"
        v-on:click.stop="restoreDice"
      >
        restore
      </div>
    </div>
    <template v-for="side in sideList">
      <div
        :id="side._id"
        :key="side._id"
        :value="side.value"
        :class="['el', side.activeEvent ? 'active-event' : '', side.eventData.fakeValue ? 'fake-value' : '']"
        v-on:click="(e) => (side.activeEvent ? (e.stopPropagation(), openDiceSideValueSelect(side._id)) : null)"
      >
        <dice-side-value-select v-if="selectedDiceSideId === side._id" v-on:select="pickActiveEventDiceSide" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import diceSideValueSelect from './diceSideValueSelect.vue';

export default {
  components: {
    diceSideValueSelect,
  },
  props: {
    diceId: String,
    inHand: Boolean,
    iam: Boolean,
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      currentRound: 'currentRound',
      currentPlayerIsActive: 'currentPlayerIsActive',
      actionsDisabled: 'actionsDisabled',
      selectedDiceSideId: 'selectedDiceSideId',
    }),
    dice() {
      const dice = this.getStore(this.diceId, 'dice');
      return dice._id ? dice : { _id: this.diceId };
    },
    sideList() {
      const sideList = this.dice.sideList || [{}, {}];
      return sideList.map(({ _id }) => {
        const side = this.getStore(_id, 'diceside');
        return side._id ? side : { eventData: {} };
      });
    },
    locked() {
      return this.dice.locked || this.actionsDisabled;
    },
    activeEvent() {
      return this.currentPlayerIsActive && this.dice.activeEvent;
    },
    hide() {
      return this.inHand && !this.iam && !this.dice.visible;
    },
    replaceAllowed() {
      return this.dice.placedAtRound !== this.currentRound;
    },
  },
  methods: {
    async chooseDice() {
      await api.game
        .action({
          name: 'eventTrigger',
          data: { eventData: { targetId: this.diceId, targetPlayerId: this.$parent.playerId } },
        })
        .catch((err) => {
          console.log({ err });
          alert(err.message);
        });
    },
    openDiceSideValueSelect(targetId) {
      this.$store.commit('setSelectedDiceSideId', targetId);
    },
    async pickActiveEventDiceSide(fakeValue) {
      await api.game
        .action({ name: 'eventTrigger', data: { eventData: { targetId: this.selectedDiceSideId, fakeValue } } })
        .catch((err) => {
          console.log({ err });
          alert(err.message);
        });
      this.$store.commit('setSelectedDiceSideId', null);
    },
    async pickDice() {
      if (!this.iam) return;
      if (this.locked) return;
      this.$store.commit('setPickedDiceId', this.diceId);
      await api.game.action({ name: 'getZonesAvailability', data: { diceId: this.diceId } }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
    },
    async rotateDice() {
      await api.game.action({ name: 'rotateDice', data: { diceId: this.diceId } }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
    },
    async deleteDice() {
      await api.game.action({ name: 'deleteDice', data: { diceId: this.diceId } }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
    },
    async restoreDice() {
      await api.game.action({ name: 'restoreDice', data: { diceId: this.diceId } }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
    },
  },
};
</script>

<style scoped>
.domino-dice {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.domino-dice.deleted {
  transform: scale(0.5);
}
.domino-dice.hide > .el {
  background-image: none;
  background: black;
}

.plane .domino-dice,
.player.iam .hand-dices .domino-dice {
  cursor: pointer;
}
.domino-dice.locked {
  opacity: 0.5;
  cursor: not-allowed !important;
}

.domino-dice > .controls {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background: darkgrey;
  opacity: 0.9;
  color: white;
  z-index: 1;
}
.zone.vertical .domino-dice > .controls {
  flex-wrap: wrap;
}
.zone.vertical .domino-dice > .controls > .control {
  height: 33.333%;
}

.plane .domino-dice:hover:not(.active-event) > .controls,
.bridge .domino-dice:hover:not(.active-event) > .controls {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.domino-dice > .controls > .control {
  width: 100%;
  height: 100%;
}
.domino-dice > .controls > .control:not(.disabled):hover {
  cursor: pointer;
  background: grey;
}

.domino-dice > .controls > .control.disabled {
  cursor: not-allowed;
  background: lightgray;
}
.domino-dice > .controls > .control.fake-rotate,
.domino-dice > .controls > .control.hidden {
  display: none;
}
.bridge .domino-dice > .controls > .control.fake-rotate {
  display: block;
}
.bridge .domino-dice > .controls > .control.rotate {
  display: none;
}

.domino-dice > .el {
  position: relative;
  flex-shrink: 0;
  float: left;
  width: 70px;
  height: 70px;
  border-radius: 15px;
  background-image: url(../../assets/Dices.png);
}
.player.iam .hand-dices .domino-dice:not(.locked):hover > .el {
  box-shadow: inset 0 0 100px 8px lightgreen;
}
.domino-dice > .el.active-event:hover {
  box-shadow: inset 0 0 10px 8px lightgreen !important;
}

.domino-dice.active-event {
  box-shadow: none !important;
}
.domino-dice.active-event > .el {
  box-shadow: inset 0 0 100px 8px yellow;
}
.domino-dice.active-event:hover > .el {
  opacity: 0.7;
}

.domino-dice > .el.fake-value {
  box-shadow: inset 0 0 100px 8px orange;
}
.domino-dice > .el {
  background-position: -497px;
}
.domino-dice > .el[value='0'] {
  background-position: -0px;
}
.domino-dice > .el[value='1'] {
  background-position: -71px;
}
.domino-dice > .el[value='2'] {
  background-position: -142px;
}
.domino-dice > .el[value='3'] {
  background-position: -213px;
}
.domino-dice > .el[value='4'] {
  background-position: -284px;
}
.domino-dice > .el[value='5'] {
  background-position: -355px;
}
.domino-dice > .el[value='6'] {
  background-position: -426px;
}
</style>
