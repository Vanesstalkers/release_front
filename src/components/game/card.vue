<template>
  <div
    v-if="card._id || cardData"
    :name="card.name"
    :class="['card-event', card.played ? 'played' : '']"
    :style="customStyle"
    v-on:click.stop="showInfo(card.name)"
  >
    <div
      v-if="canPlay && sessionPlayerIsActive && !actionsDisabled && !card.played"
      v-on:click.stop="playCard"
      class="play-btn"
    >
      Разыграть
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  props: {
    cardId: String,
    canPlay: Boolean,
    cardData: Object,
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      actionsDisabled: 'actionsDisabled',
      sessionPlayerIsActive: 'sessionPlayerIsActive',
    }),
    card() {
      if(this.cardData) return this.cardData;
      const card = this.getStore(this.cardId, 'card');
      return card._id ? card : { _id: this.cardId };
    },
    customStyle() {
      const style = { backgroundImage: `url(/img/cards/release/${this.card.name}.jpg)` };
      return style;
    },
  },
  methods: {
    async playCard() {
      if (this.card.played) return;
      await api.game.action({ name: 'playCard', data: { cardId: this.cardId } }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
    },
    showInfo(name) {
      this.$store.commit('setShownCard', name);
    },
  },
  mounted() {},
};
</script>

<style>
.card-event {
  position: relative;
  cursor: help;
  border: 1px solid;
  width: 120px;
  height: 180px;
  background-size: cover;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  border-radius: 10px;
  margin: 0px 0px 0px 5px;
  box-shadow: inset 0px 20px 20px 0px black;
  background-image: url(/img/cards/release/back-side.jpg);
}
/* .card-event:hover:after {
  content: '?';
  position: absolute;
  color: white;
  top: 0px;
  right: 0px;
} */
.card-event.played {
  filter: grayscale(1);
}
.play-btn {
  cursor: pointer;
  position: absolute;
  bottom: 0px;
  width: 100px;
  font-size: 0.5em;
  border: 1px solid black;
  text-align: center;
  cursor: pointer;
  margin: 6px 10px;
  background: #3f51b5;
  color: white;
  font-size: 16px;
  padding: 8px 0px;
}
.card-event.active {
  border: 4px solid green;
}
</style>
