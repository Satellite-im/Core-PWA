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
    areTyping(): boolean {
      const conversationId = this.$route.params.id
      if (!conversationId) {
        return false
      }

      const convTypingStatus = iridium.chat.typingStatus[conversationId] || {}

      return !!Object.keys(convTypingStatus).filter(
        (k) => convTypingStatus?.[k],
      ).length
    },
    lengthCount() {
      return `${this.ui.chatbarContent.length}/${this.$Config.chat.maxChars}`
    },
  },
})
</script>

<style scoped lang="less" src="./Footer.less"></style>
