<template>
  <div class="test">
    id={{id}}
    storeData={{storeData}}
    <hr>
  </div>
</template>

<script>

export default {
  props: {
    id: String,
  },
  computed: {
    storeData (){
      return this.$store.getters.getSimpleTest(this.id);
    },
  },
  methods: {
    
  },
  mounted() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
