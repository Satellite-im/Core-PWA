<template src="./Nav.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

import { ShoppingBagIcon, ClockIcon } from 'satellite-lucide-icons'
import { ModalWindows } from '~/store/ui/types'

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
        name: ModalWindows.CALL_TO_ACTION,
        state: !this.ui.modals[ModalWindows.CALL_TO_ACTION],
      })
    },
  },
})
</script>
<style scoped lang="less" src="./Nav.less"></style>
