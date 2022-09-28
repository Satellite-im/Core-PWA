<template src="./Actions.html" />
<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  SmileIcon,
  CornerDownRightIcon,
  ArchiveIcon,
  EditIcon,
  MoreVerticalIcon,
} from 'satellite-lucide-icons'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    SmileIcon,
    CornerDownRightIcon,
    ArchiveIcon,
    EditIcon,
    MoreVerticalIcon,
  },
  props: {
    setReplyChatbarMessage: {
      type: Function,
      default: () => () => {},
    },
    emojiReaction: {
      type: Function,
      default: () => () => {},
    },
    hideReply: {
      type: Boolean,
      default: false,
      required: false,
    },
    editMessage: {
      type: Function,
      default: () => () => {},
    },
    message: {
      type: Object as PropType<ConversationMessage>,
      default: null,
    },
  },
  data() {
    return {
      hasMoreSettings: false,
      featureReadyToShow: false,
      chat: iridium.chat.state,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      accounts: (state) => (state as RootState).accounts,
    }),
    conversationId(): Conversation['id'] {
      return this.$route.params.id
    },
    conversation(): Conversation | undefined {
      if (!this.conversationId) {
        return undefined
      }
      return this.chat.conversations[this.conversationId]
    },
    isGroup(): boolean {
      return this.conversation?.type === 'group'
    },
    isEditable(): boolean {
      // Only text messages atm
      return this.message.from === iridium.id && this.message.type === 'text'
    },
  },
})
</script>
<style lang="less" scoped src="./Actions.less"></style>
