<template src="./Footer.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
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
  data() {
    return {
      chat: iridium.chat,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    typingParticipants() {
      const conversationId = this.$route.params.id
      if (!conversationId) {
        return
      }
      return this.chat.getTypingParticipants(conversationId)
    },
    lengthCount() {
      return `${this.ui.chatbarContent.length}/${this.$Config.chat.maxChars}`
    },
  },
})
</script>

<style scoped lang="less" src="./Footer.less"></style>
