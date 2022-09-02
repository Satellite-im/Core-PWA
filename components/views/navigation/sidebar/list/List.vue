<template src="./List.html"></template>

<script lang="ts">
import Vue from 'vue'
import { UserPlusIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  components: {
    UserPlusIcon,
  },
  data() {
    return {
      loading: false,
      chat: iridium.chat.state,
      iridium,
    }
  },
  computed: {
    sortedConversations(): Conversation[] {
      return iridium.chat.getSortedConversations()
    },
  },
})
</script>

<style scoped lang="less" src="./List.less"></style>
