<template src="./Nav.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { ShoppingBagIcon, ClockIcon } from 'satellite-lucide-icons'

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
      this.$store.commit('ui/toggleModal', {
        name: 'marketplace',
        state: !this.ui.modals.marketplace,
      })
    },
  },
})
</script>
<style scoped lang="less" src="./Nav.less"></style>
