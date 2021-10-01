<template src="./Nav.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  data() {
    return {
      selectedPack: null,
    }
  },
  computed: {
    ...mapState(['ui', 'search']),
  },
  methods: {
    toggleMarketPlace() {
      this.$store.commit('toggleModal', {
        name: 'showMarketPlace',
        state: !this.ui.modals.showMarketPlace,
      })
    },
  },
})
</script>
<style scoped lang="less" src="./Nav.less"></style>
