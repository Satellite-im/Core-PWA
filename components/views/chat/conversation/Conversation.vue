<template src="./Conversation.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  props: {},
  computed: {
    ...mapState(['ui', 'textile', 'chat']),
    options() {
      return {
        threshold: 0,
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
    conversationId() {
      return this.$route.params?.address
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
          block: this.direction === 'bottom' ? 'end' : 'start',
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
      } else {
        complete()
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
