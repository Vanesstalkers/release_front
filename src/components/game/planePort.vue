<template>
  <div
    class="port"
    :style="{ left: port.left + 'px', top: port.top + 'px' }"
  />
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";

export default {
  props: {
    port: Object,
  },
  computed: {
    ...mapGetters({
    }),
  },
  methods: {
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
    ---border: 1px solid yellow;
  }
</style>
