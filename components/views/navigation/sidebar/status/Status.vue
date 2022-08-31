<template src="./Status.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { UserStatus, User } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  data() {
    return { status: 'online' }
  },
  computed: {
    profile(): User | undefined {
      return iridium.profile.state
    },
  },
  methods: {
    copyId() {
      if (!iridium.connector) return
      const shortID = this.profile
        ? `${this.profile.name}#${iridium.connector.id.substring(
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
