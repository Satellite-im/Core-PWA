<template src="./Footer.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { CircleIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    CircleIcon,
  },
  props: {
    charlimit: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    typingParticipants(): string[] {
      const conversationId = this.$route.params.id
      if (!conversationId) {
        return []
      }
      const conversation = iridium.chat.getConversation(conversationId)
      if (!conversation || !conversation.typing) {
        return []
      }

      return Object.keys(conversation.typing).filter(
        (k) => conversation.typing?.[k],
      )
    },
    lengthCount() {
      return `${this.ui.chatbarContent.length}/${this.$Config.chat.maxChars}`
    },
  },
})
</script>

<style scoped lang="less" src="./Footer.less"></style>
