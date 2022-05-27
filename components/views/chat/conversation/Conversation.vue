<template src="./Conversation.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ChevronDownIcon } from 'satellite-lucide-icons'
import { ScrollDirections } from '~/types/chat/chat'

export default Vue.extend({
  components: {
    ChevronDownIcon,
  },
  props: {
    groupId: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState(['ui', 'textile', 'chat']),
    options() {
      return {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '100px 0px 0px 0px',
        root: this.$refs.chatScroll,
      }
    },
    messages() {
      return this.chat.currentChat.messages
    },
    direction() {
      return this.chat.currentChat.direction
    },
    isReversedScroll() {
      return this.direction === ScrollDirections.TOP
    },
    conversationId() {
      return this.$route.params?.address
    },
    showOlderMessageInfo() {
      return this.ui.showOlderMessagesInfo
    },
    isMediaOpen() {
      return (
        this.$store.state.webrtc.activeCall &&
        this.$store.state.webrtc.activeCall.callId
      )
    },
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
          block: this.direction === ScrollDirections.TOP ? 'start' : 'end',
          behavior: 'auto',
        })
      })
    },
    loadMore() {
      this.$store.dispatch('chat/loadMessages', this.conversationId)
    },
    handleIntersect({ loaded, complete }) {
      if (
        this.chat.currentChat.hasNextPage &&
        !this.chat.currentChat.isMessagesLoading
      ) {
        this.loadMore()
        this.scrollToMessage(this.chat.currentChat.lastLoadedMessageId)
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
