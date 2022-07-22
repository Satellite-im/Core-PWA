<template src="./Conversation.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ChevronDownIcon } from 'satellite-lucide-icons'
import { ScrollDirections } from '~/types/chat/chat'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    ChevronDownIcon,
  },
  data() {
    return {
      messages: iridium.chat.messages[this.$route.params.id],
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      showOlderMessageInfo: (state) =>
        (state as RootState).ui.showOlderMessagesInfo,
      textile: (state) => (state as RootState).textile,
      currentChat: (state) => (state as RootState).chat.currentChat,
      webrtc: (state) => (state as RootState).webrtc,
      conversation: (state) => (state as RootState).conversation,
    }),
    options() {
      return {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '100px 0px 0px 0px',
        root: this.$refs.chatScroll,
      }
    },
    isReversedScroll() {
      return this.currentChat.direction === ScrollDirections.TOP
    },
    conversationId() {
      return this.$route.params?.address || this.$route.params?.id
    },
    isActiveCall() {
      return (
        this.webrtc.activeCall &&
        this.webrtc.activeCall.callId === this.conversation.id
      )
    },
    myDid(): string {
      return iridium.connector?.id ?? ''
    },
    // groupedMessages() {
    //   const { address } = this.$route.params
    //   const conversation = this.$typedStore.state.textile.conversations[address]
    //   if (!conversation) return []
    //   const { messages, replies, reactions } = conversation
    //   return groupMessages(messages, replies, reactions)
    // },
  },
  beforeDestroy() {
    this.$store.commit('chat/resetCurrentChat')
  },
  methods: {
    scrollToMessage(messageId: string) {
      if (!messageId) {
        return
      }

      this.$nextTick(() => {
        const messageNode = document.getElementById(messageId)
        if (!messageNode) {
          return
        }
        messageNode.scrollIntoView({
          block:
            this.currentChat.direction === ScrollDirections.TOP
              ? 'start'
              : 'end',
          behavior: 'auto',
        })
      })
    },
    loadMore() {
      this.$store.dispatch('chat/loadMessages', this.conversationId)
    },
    handleIntersect({ loaded, complete }) {
      if (this.currentChat.hasNextPage && !this.currentChat.isMessagesLoading) {
        this.loadMore()
        this.scrollToMessage(this.currentChat.lastLoadedMessageId)
        loaded()
        return
      }
      complete()
    },
    handleClick() {
      this.$refs.chatScroll?.autoScrollToBottom()
    },
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
