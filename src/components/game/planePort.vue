<template>
  <div
    class="port"
    :_id="port._id"
    :style="{ left: port.left + 'px', top: port.top + 'px' }"
    v-on:click.stop="selectPort"
  >
    {{ port }}
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";

export default {
  props: {
    port: Object,
  },
  computed: {
    ...mapGetters({
      selectedPort: "selectedPort",
    }),
  },
  methods: {
    selectPort(event) {
      const portId = event.target.attributes._id.value;
      if (!this.selectedPort) {
        this.$store.commit("setSelectedPort", portId);
      } else {
        api.game.getPlanePortsAvailability({
          gameId: this.$route.params.id,
          joinPortId: this.selectedPort,
          targetPortId: portId,
        });
        this.$store.commit("setSelectedPort", null);
      }
    },
  },
  mounted() {
    console.log("planePort mounted", this.plane);
    this.$store.dispatch("setSimple", { [this.port._id]: this.port });
  },
};
</script>

<style scoped>
.port {
  position: absolute;
  height: 73px;
  width: 73px;
  border: 1px solid yellow;
}
.port:hover {
  background-color: yellow;
  --background-image: url("/blocks/__tpl/static/img/rotate-right.png");
  background-size: contain;
}
.port:hover:before {
  content: "code-" attr(data-code) "\A"attr(data-direct);
  background: white;
  padding: 5px;
  top: -20px;
  position: absolute;
}

.port-wraper.ready_for_connect > .ready_for_connect:not(.linked) {
  -webkit-animation: shadow 1s infinite alternate;
  -moz-animation: shadow 1s infinite alternate;
  -ms-animation: shadow 1s infinite alternate;
  -o-animation: shadow 1s infinite alternate;
  animation: shadow 1s infinite alternate;
}
.port-wraper > .search_for_connect {
  background: yellow;
}
@-webkit-keyframes shadow {
  from {
    box-shadow: inset 0 0 0 0 transparent;
  }
  to {
    box-shadow: inset 0 0 10px 20px yellow;
  }
}
@-moz-keyframes shadow {
  from {
    box-shadow: inset 0 0 0 0 transparent;
  }
  to {
    box-shadow: inset 0 0 10px 20px yellow;
  }
}
@-ms-keyframes shadow {
  from {
    box-shadow: inset 0 0 0 0 transparent;
  }
  to {
    box-shadow: inset 0 0 10px 20px yellow;
  }
}
@-o-keyframes shadow {
  from {
    box-shadow: inset 0 0 0 0 transparent;
  }
  to {
    box-shadow: inset 0 0 10px 20px yellow;
  }
}
@keyframes shadow {
  from {
    box-shadow: inset 0 0 0 0 transparent;
  }
  to {
    box-shadow: inset 0 0 10px 20px yellow;
  }
}
</style>
