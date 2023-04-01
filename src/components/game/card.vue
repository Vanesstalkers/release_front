<template>
  <div
    v-if="card._id"
    :class="['card-event', card.played ? 'played' : '', 'card-event-' + card.name]"
    :style="customStyle"
    v-on:click.stop=""
  >
    <div
      v-if="canPlay && currentPlayerIsActive && !actionsDisabled && !card.played"
      v-on:click="playCard"
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
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      actionsDisabled: 'actionsDisabled',
      currentPlayerIsActive: 'currentPlayerIsActive',
    }),
    card() {
      const card = this.getStore(this.cardId, 'card');
      return card._id ? card : { _id: this.cardId };
    },
    customStyle() {
      const style = {};
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
  },
  mounted() {},
};
</script>

<style>
.card-event {
  position: relative;
  cursor: default;
  border: 1px solid;
  width: 180px;
  height: 270px;

  /* width: 120px;
  height: 180px; */
  background-size: cover;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  border-radius: 10px;
  margin: 0px 0px 0px 5px;
  box-shadow: 4px 4px 0px 0px rgb(0 0 0 / 34%);
  background-image: url(../../assets/cards/back-side.jpg);
}
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
.card-event-water {
  background-image: url(../../assets/cards/water.jpg);
}
.card-event-teamlead {
  background-image: url(../../assets/cards/teamlead.jpg);
}
.card-event-weekend {
  background-image: url(../../assets/cards/weekend.jpg);
}
.card-event-req_legal {
  background-image: url(../../assets/cards/req_legal.jpg);
}
.card-event-req_tax {
  background-image: url(../../assets/cards/req_tax.jpg);
}
.card-event-pilot {
  background-image: url(../../assets/cards/pilot.jpg);
}
.card-event-claim {
  background-image: url(../../assets/cards/claim.jpg);
}
.card-event-transfer {
  background-image: url(../../assets/cards/transfer.jpg);
}
.card-event-take_project {
  background-image: url(../../assets/cards/take_project.jpg);
}
.card-event-give_project {
  background-image: url(../../assets/cards/give_project.jpg);
}
.card-event-superman {
  background-image: url(../../assets/cards/superman.jpg);
}
.card-event-insight {
  background-image: url(../../assets/cards/insight.jpg);
}
.card-event-lib {
  background-image: url(../../assets/cards/lib.jpg);
}
.card-event-showoff {
  background-image: url(../../assets/cards/showoff.jpg);
}
.card-event-emergency {
  background-image: url(../../assets/cards/emergency.jpg);
}
.card-event-security {
  background-image: url(../../assets/cards/security.jpg);
}
.card-event-dream {
  background-image: url(../../assets/cards/dream.jpg);
}
.card-event-refactoring {
  background-image: url(../../assets/cards/refactoring.jpg);
}
.card-event-audit {
  background-image: url(../../assets/cards/audit.jpg);
}

.card-event.active {
  border: 4px solid green;
}
</style>
