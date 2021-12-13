<template>
  <div class="bridge" :_id="bridge._id">
    {{bridge}}
  </div>
</template>

<script>

export default {
  name: 'bridge',
  components: {
  },
  props: {
    bridge: Object,
  },
  methods: {

  },
  mounted() {
    console.log('bridge mounted', this.bridge);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
