<template>
  <div
    :style="{
      left: zoneData.left + 'px',
      top: zoneData.top + 'px',
      color: 'white',
      fontSize: '10px',
    }"
    :class="[
      'zone',
      zoneData.vertical ? 'vertical' : '',
      zoneData.available ? 'available' : '',
    ]"
    v-on:click="putDice"
  >
    <div class="wraper">
      <plane-zone-sides :sideList="zoneData.sideList" />
      <dice v-for="dice in zoneData.itemList" :key="dice._id" :dice="dice" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import planeZoneSides from "./planeZoneSides.vue";
import dice from "./dice.vue";

export default {
  components: {
    planeZoneSides,
    dice,
  },
  props: {
    zone: Object,
  },
  computed: {
    zoneData() {
      return { ...this.getSimple(this.zone._id, "zone"), ...this.zone };
    },
    ...mapGetters({
      getSimple: "getSimple",
      pickedDiceId: "pickedDiceId",
    }),
  },
  methods: {
    putDice() {
      if (this.pickedDiceId) {
        api.game.replaceDice({
          gameId: this.$route.params.id,
          diceId: this.pickedDiceId,
          zoneId: this.zone._id,
        });
        this.$store.commit("setPickedDiceId", null);
        this.$store.commit("hideZonesAvailability");
      }
    },
  },
  mounted() {
    console.log("planeZone mounted", this.zone);
    //this.$store.dispatch("setData", { zone: { [this.zone._id]: this.zone } });
  },
};
</script>

<style scoped>
.zone {
  position: absolute;
  height: 73px;
  width: 142px;
  border: 1px solid green;
  white-space: pre;
  background: url(../../assets/clear-black-back.png);
}
.zone.vertical {
  height: 142px;
  width: 73px;
}
.zone > .wraper {
  position: relative;
  height: 100%;
  width: 100%;
}
.zone > .wraper > .domino-dice {
  position: absolute;
  top: 0px;
  left: 0px;
}
.zone.available {
  box-shadow: inset 0 0 20px 8px lightgreen;
}
.zone.available.hard {
  box-shadow: inset 0 0 20px 8px yellow;
}
/* 					.*css*[data-vertical="1"], .*css*[data-vertical="1"] .domino-dice {
						height: 142px;
						width: 73px;
					}
					.*css*:hover {
						box-shadow: inset 0 0 20px 8px lightgreen;
					}
					.*css*:hover:before {
						content: 'value-' attr(data-value) '\A' attr(data-z) '\A' 'v1-' attr(data-v1) '\A' 'v2-' attr(data-v2);
						background: white;
						padding: 5px;
						top: -20px;
						position: absolute;
					}
					.*css* > .item-controls {
						margin-right: -24px;
					}
					.*css* > .g-token {
						position: absolute;
						left: calc(50% - 30px);
						top: 5px;
					}
					.*css*[data-vertical] > .g-token {
						left: 5px;
						top: calc(50% - 30px);
					}
					.*css*[data-value] > .g-token {
						left: calc(50% - 20px);
						top: 15px;
						z-index: 1;
					}
					.*css*[data-value] > .g-token > select.g-token {
						width: 40px!important;
						height: 40px!important;
					}
					.*css*[data-value][data-vertical] > .g-token {
						left: 15px;
						top: calc(50% - 20px);
					}
					.*css*:not([data-value]) > .g-token > select.g-token {
						background-color: #ffffff00;
					}
					.*css*[data-deleted_dice] .domino-dice {
						transform: scale(0.5);
					} */
</style>
