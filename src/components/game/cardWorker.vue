<template>
  <div
    v-if="cardData._id"
    :id="cardData._id"
    :class="[
      'card-worker',
      'card-worker-' + cardData.code,
      cardData.active ? 'active' : '',
      choiceEnabled ? 'active-event' : '',
    ]"
    :style="customStyle"
  >
    <div v-if="!iam" class="card-event">
      {{ Object.keys(cardDeckCount).length }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  props: {
    cardData: Object,
    iam: Boolean,
  },
  computed: {
    ...mapGetters({
      getSimple: 'getSimple',
      currentPlayerIsActive: 'currentPlayerIsActive',
    }),
    customStyle() {
      const style = {};
      // style.backgroundImage = `url(../../assets/cards/${this.card.name||'unknown'}.jpg)`;
      // style.backgroundImage = `url(../../assets/plane.png)`;
      return style;
    },
    choiceEnabled() {
      return this.currentPlayerIsActive && this.cardData.activeEvent?.choiceEnabled;
    },
    cardDeckCount() {
      return (
        Object.keys(
          Object.keys(this.cardData.deckMap || {})
            .map((id) => this.getSimple(id, 'deck'))
            .filter((deck) => deck.type === 'card' && !deck.subtype)[0]?.itemMap || {},
        ).length || 0
      );
    },
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.card-worker {
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

  background-image: url(../../assets/workers/1.jpg);
}
.card-worker-1 {
  background-image: url(../../assets/workers/1.jpg);
}
.card-worker-2 {
  background-image: url(../../assets/workers/2.jpg);
}
.card-worker-3 {
  background-image: url(../../assets/workers/3.jpg);
}
.card-worker-4 {
  background-image: url(../../assets/workers/4.jpg);
}
.card-worker-5 {
  background-image: url(../../assets/workers/5.jpg);
}
.card-worker.active {
  outline: 4px solid green;
}

.card-worker .card-event {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 60px;
  height: 90px;
  color: white;
  border: none;
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-content: center;
}
#game.mobile-view.portrait-view .card-worker .card-event {
  left: auto;
  right: 0px;
}
</style>
