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
  props: {
    filter: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      chat: iridium.chat.state,
    }
  },
  computed: {
    sortedConversations(): Conversation[] {
      const conv = iridium.chat.getSortedConversations()
      if (!this.filter) {
        return conv
      }
      return conv.filter((c) => {
        return c.name
          ?.toLocaleLowerCase()
          .includes(this.filter.toLocaleLowerCase())
      })
    },
  },
})
</script>

<style scoped lang="less" src="./List.less"></style>
