<template src="./QuickProfile.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { User } from '~/types/ui/user'

export default Vue.extend({
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => {},
    },
  },
  mounted() {
    this.handleOverflow()
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    close() {
      this.$store.commit('quickProfile', false)
    },
    handleOverflow() {
      if (this.$device.isDesktop) {
        const quickProfile = this.$refs.quickProfile as HTMLElement
        const position = this.ui.quickProfilePosition
        let clickX = position.x
        let clickY = position.y
        const widthOverflow =
          clickX + quickProfile.clientWidth - window.innerWidth
        const heightOverflow =
          clickY + quickProfile.clientHeight - window.innerHeight
        if (widthOverflow > -8) {
          clickX -= quickProfile.clientWidth
          this.$store.commit('setQuickProfilePosition', {
            x: clickX,
            y: clickY,
          })
        }
        if (heightOverflow > -8) {
          clickY -= heightOverflow + 12
          this.$store.commit('setQuickProfilePosition', {
            x: clickX,
            y: clickY,
          })
        }
      }
    },
  },
})
</script>
<style scoped lang="less" src="./QuickProfile.less"></style>
