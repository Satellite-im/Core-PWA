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
    showStatusModal: false,
    featureReady: true,
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
    toggleStatusChange() {
      if (this.featureReady) {
        this.showStatusModal = !this.showStatusModal
      }
    },
    closeStatusModal() {
      this.showStatusModal = false
    },
  },
})
</script>

<style scoped lang="less" src="./Status.less"></style>
