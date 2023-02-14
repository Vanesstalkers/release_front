<template>
  <div
    v-if="card._id"
    :class="['card-event', card.deleted ? 'deleted' : '', 'card-event-' + card.name]"
    :style="customStyle"
    v-on:click.stop="playCard"
  />
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  props: {
    cardId: String,
  },
  computed: {
    ...mapGetters({
      getSimple: 'getSimple',
    }),
    card() {
      return this.getSimple(this.cardId, 'card');
    },
    customStyle() {
      const style = {};
      return style;
    },
  },
  methods: {
    async playCard() {
      await api.game.action({ name: 'playCard', data: { cardId: this.cardId } }).catch((err) => {
        console.log({ err });
        alert(err.message);
      });
    },
  },
  mounted() {},
};
</script>

<style scoped>
.card-event {
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

  background-image: url(../../assets/cards/unknown.jpg);
}
.card-event-coffee {
  background-image: url(../../assets/cards/coffee.jpg);
}
.card-event-crutch {
  background-image: url(../../assets/cards/crutch.jpg);
}
.card-event-disease {
  background-image: url(../../assets/cards/disease.jpg);
}
.card-event-flowstate {
  background-image: url(../../assets/cards/flowstate.jpg);
}
.card-event-rain {
  background-image: url(../../assets/cards/rain.jpg);
}
.card-event-teamlead {
  background-image: url(../../assets/cards/teamlead.jpg);
}
.card-event-weekend {
  background-image: url(../../assets/cards/weekend.jpg);
}
.card-event.active {
  border: 4px solid green;
}
</style>
