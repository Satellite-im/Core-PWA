<template src="./Status.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
    }),
    src(): string {
      const hash = this.accounts.details?.profilePicture
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
  },
  methods: {
    copyId() {
      if (!iridium.connector) return
      const shortID = iridium.profile.state
        ? `${iridium.profile.state.name}#${iridium.connector.id.substring(
            iridium.connector.id.length - 6,
          )}`
        : `${iridium.connector?.id}`
      navigator.clipboard.writeText(shortID)
      this.$toast.show(this.$t('ui.copied') as string)
    },
  },
})
</script>

<style scoped lang="less" src="./Status.less"></style>
