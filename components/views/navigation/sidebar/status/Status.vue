<template src="./Status.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
    }),
    src(): string {
      const hash = this.accounts.details.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  methods: {
    copyId() {
      navigator.clipboard.writeText(this.accounts.active)
      this.$toast.show(this.$t('ui.copied') as string)
    },
  },
})
</script>

<style scoped lang="less" src="./Status.less"></style>
