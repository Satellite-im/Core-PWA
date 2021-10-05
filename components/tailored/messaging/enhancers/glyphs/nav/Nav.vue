<template src="./Nav.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

// @ts-ignore
import { ShoppingBagIcon, ClockIcon } from 'vue-feather-icons'

export default Vue.extend({
  components: {
    ShoppingBagIcon,
    ClockIcon,
  },
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
