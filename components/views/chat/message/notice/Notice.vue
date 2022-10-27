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
      if (this.message.from === iridium.id) {
        return this.$t('messaging.group_join_notice.you') as string
      }
      return iridium.users.getUser(this.message.from)?.name || ''
    },
    members(): string {
      if (!this.message.members) {
        return ''
      }
      return this.message.members
        .map((did) => {
          if (did === iridium.id) {
            return this.$t('messaging.group_join_notice.you')
          }
          return iridium.users.getUser(did)?.name
        })
        .filter((name) => name)
        .join(', ')
    },
  },
})
</script>

<style scoped lang="less" src="./Notice.less"></style>
