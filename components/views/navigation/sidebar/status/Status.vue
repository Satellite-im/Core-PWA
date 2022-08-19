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
      if (iridium.connector) {
        navigator.clipboard.writeText(iridium.connector?.id)
        this.$toast.show(this.$t('ui.copied') as string)
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Status.less"></style>
