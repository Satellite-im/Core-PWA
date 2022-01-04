<template src="./Nav.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

import { ShoppingBagIcon, ClockIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    ShoppingBagIcon,
    ClockIcon,
  },
  computed: {
    ...mapState(['ui']),
    ...mapGetters('ui', ['getSortedRecentGlyphs']),
    recentGlyphs() {
      if (this.$mq === 'xs') {
        return this.getSortedRecentGlyphs.slice(0, 5)
      }
      if (this.$mq === 'sm') {
        return this.getSortedRecentGlyphs.slice(0, 6)
      }
      return this.getSortedRecentGlyphs.slice(0, 11)
    },
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
