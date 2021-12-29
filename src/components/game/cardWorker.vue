<template>
  <div
    :id="cardData._id"
    :class="[
      'card-worker',
      'card-worker-' + cardData.code,
      cardData.active ? 'active': '',
      cardData.activeEvent ? 'active-event' : '',
    ]"
    :style="customStyle"
  >
    <div class="controls">
      <!-- <div class="control" v-on:click.stop="pickDice">move</div> -->
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
.card-worker {
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
</style>
