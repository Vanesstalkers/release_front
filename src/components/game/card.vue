<template>
  <div
    v-if="card._id || cardData"
    :name="card.name"
    :class="['card-event', card.played ? 'played' : '', this.isSelected ? 'selected' : '']"
    :style="customStyle"
    v-on:click.stop="toggleSelect"
  >
    <div class="card-info-btn" v-on:click.stop="showInfo(card.name)" />
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
    isSelected: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      actionsDisabled: 'actionsDisabled',
      sessionPlayerIsActive: 'sessionPlayerIsActive',
    }),
    card() {
      if (this.cardData) return this.cardData;
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
      await api.game.action({ name: 'playCard', data: { cardId: this.cardId } }).catch(err => {
        prettyAlert(err.message);
      });
    },
    toggleSelect() {
      this.$store.commit('setSelectedCard', this.isSelected ? null : this.cardId);
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
  background-color: grey;
}
.card-event.selected {
  z-index: 1;
  box-shadow: 0px 100px 100px 0px black;
}
.card-info-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 30px;
  height: 30px;
  background-image: url(../../assets/info.png);
  background-size: contain;
  cursor: pointer;
  visibility: hidden;
}
.card-info-btn:hover {
  opacity: 0.7;
}
.card-event:hover > .card-info-btn,
#game.mobile-view .card-event.selected > .card-info-btn {
  visibility: visible;
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
