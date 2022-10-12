<template src="./Status.html"></template>

<script lang="ts">
import Vue from 'vue'
import { ClipboardCopyIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    ClipboardCopyIcon,
  },
  data: () => ({
    profile: iridium.profile.state,
  }),
  methods: {
    copyId() {
      if (!iridium.connector) return
      const shortID = this.profile
        ? `${this.profile.name}#${iridium.id.substring(iridium.id.length - 6)}`
        : `${iridium.id}`
      navigator.clipboard.writeText(shortID)
      this.$toast.show(this.$t('ui.copied') as string)
    },
    openQuickProfile() {
      const status = this.$refs.status as HTMLElement
      const { x, y } = status.getBoundingClientRect()
      const horizOffset = 32
      const vertOffset = 136

      this.$store.commit('ui/setQuickProfile', {
        user: this.profile,
        position: { x: x - horizOffset, y: y - vertOffset },
        showStatusChange: true,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Status.less"></style>
