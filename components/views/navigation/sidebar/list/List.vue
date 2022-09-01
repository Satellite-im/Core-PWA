<template src="./List.html"></template>

<script lang="ts">
import Vue from 'vue'
import { UserPlusIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { UserStatus } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  components: {
    UserPlusIcon,
  },
  data() {
    return {
      loading: false,
      chat: iridium.chat.state,
      users: iridium.users.state,
      userStatus: iridium.users.ephemeral.status,
    }
  },
  computed: {
    conversationIds(): string[] {
      return iridium.chat.state.conversationIds
    },
    lastActivityAt(): number {
      return iridium.chat.state.lastActivityAt
    },
  },
})
</script>

<style scoped lang="less" src="./List.less"></style>
