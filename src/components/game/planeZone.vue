<template>
  <div
	:_id="zone._id"
    :code="zone.storageCode"
    :style="{ left: zone.left + 'px', top: zone.top + 'px' }"
    :class="['zone', zone.vertical ? 'vertical' : '']"
	v-on:click="putDice"
  >
    <dice v-for="dice in zone.itemList" :key="dice._id" :dice="dice" />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import dice from "./dice.vue";

export default {
  components: {
    dice,
  },
  props: {
    zone: Object,
  },
  computed: {
    ...mapGetters({
      pickedDice: "pickedDice",
    }),
  },
  methods: {
    putDice (event) {
      if(this.pickedDice){
        const code = event.target.attributes._id.value;
      	console.log('putDice', this.pickedDice, 'to', code);
		api.game.replaceDice({gameId: this.$route.params.id, diceCode: this.pickedDice, zoneCode: code });
      }
    },
  },
  mounted() {
    console.log("planeZone mounted", this.plane);
    this.$store.dispatch("setSimple", { [this.zone._id]: this.zone });
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
					.*css*.available {
						box-shadow: inset 0 0 20px 8px lightgreen;
					}
					.*css*.available.hard {
						box-shadow: inset 0 0 20px 8px yellow;
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
