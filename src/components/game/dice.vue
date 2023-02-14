<template>
  <div v-if="dice._id" :class="['domino-dice', dice.deleted ? 'deleted' : '']" v-on:click.stop="pickDice">
    <div class="controls">
      <div class="scroll-off control" v-on:click.stop="pickDice">move</div>
      <div class="scroll-off control rotate" v-on:click.stop="rotateDice">rotate</div>
      <div class="scroll-off control fake" v-on:click.stop>disabled rotate</div>
      <div v-if="!dice.deleted" class="scroll-off control" v-on:click.stop="deleteDice">delete</div>
      <div v-if="dice.deleted" class="scroll-off control" v-on:click.stop="restoreDice">restore</div>
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
  },
  computed: {
    ...mapGetters({
      getSimple: 'getSimple',
      selectedDiceSideId: 'selectedDiceSideId',
    }),
    dice() {
      return this.getSimple(this.diceId, 'dice');
    },
    sideList() {
      return this.dice.sideList.map(({ _id }) => this.getSimple(_id, 'diceside'));
    },
  },
  methods: {
    openDiceSideValueSelect(targetId) {
      this.$store.commit('setSelectedDiceSideId', targetId);
    },
    async pickActiveEventDiceSide(fakeValue) {
      await api.game
        .action({
          name: 'eventTrigger',
          data: {
            eventData: { targetId: this.selectedDiceSideId, fakeValue },
          },
        })
        .catch((err) => {
          console.log({ err });
          alert(err.message);
        });
      this.$store.commit('setSelectedDiceSideId', null);
    },
    async pickDice() {
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
  created() {
    this.$store.dispatch('setData', { dice: { [this.dice._id]: this.dice } });
  },
  mounted() {},
};
</script>

<style scoped>
.domino-dice {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  cursor: pointer;
}
.domino-dice.deleted {
  transform: scale(0.5);
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

.plane .domino-dice:hover > .controls,
.bridge .domino-dice:hover > .controls {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.domino-dice > .controls > .control {
  width: 100%;
  height: 100%;
}
.domino-dice > .controls > .control:not(.fake):hover {
  cursor: pointer;
  background: grey;
}

.domino-dice > .controls > .control.fake {
  display: none;
}
.bridge .domino-dice > .controls > .control.fake {
  display: block;
  cursor: not-allowed;
  background: lightgray;
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
  cursor: pointer;
}
.player.iam .hand-dices .domino-dice:hover > .el {
  box-shadow: inset 0 0 20px 8px lightgreen;
}
.domino-dice > .el.active-event:hover {
  box-shadow: inset 0 0 20px 8px lightgreen !important;
}

.domino-dice > .el.fake-value {
  box-shadow: inset 0 0 20px 8px orange;
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
