<template>
  <div
    :class="[
      'card-event',
      cardData.deleted ? 'deleted' : '',
      'card-event-' + cardData.name,
    ]"
    :style="customStyle"
  >
    <div class="controls">
      <!-- <div class="control" v-on:click.stop="pickDice">move</div>
      <div class="control rotate" v-on:click.stop="rotateDice">rotate</div>
      <div class="control fake" v-on:click.stop>disabled rotate</div>
      <div class="control" v-on:click.stop="deleteDice">delete</div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";

export default {
  props: {
    card: Object,
  },
  computed: {
    ...mapGetters({
      getSimple: "getSimple",
    }),
    cardData() {
      return { ...this.getSimple(this.card._id, "card"), ...this.card };
    },
    customStyle() {
      const style = {};
      // style.backgroundImage = `url(../../assets/cards/${this.card.name||'unknown'}.jpg)`;
      // style.backgroundImage = `url(../../assets/plane.png)`;
      return style;
    },
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
/* .card-event {
    
  } */
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
