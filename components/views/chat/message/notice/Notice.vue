<template src="./Notice.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ArrowLeftIcon, ArrowRightIcon } from 'satellite-lucide-icons'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    ArrowLeftIcon,
    ArrowRightIcon,
  },
  props: {
    message: {
      type: Object as PropType<ConversationMessage>,
      required: true,
    },
  },
  computed: {
    from(): string {
      return iridium.users.getUser(this.message.from).name
    },
    members(): string {
      if (!this.message.members) {
        return ''
      }
      return this.message.members
        .map((did) => iridium.users.getUser(did)?.name)
        .filter((name) => name)
        .join(', ')
    },
  },
})
</script>

<style scoped lang="less" src="./Notice.less"></style>
