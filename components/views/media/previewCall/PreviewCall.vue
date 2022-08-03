<template src="./PreviewCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { CornerUpLeftIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    CornerUpLeftIcon,
  },
  data() {
    return {
      chat: iridium.chat,
      webrtc: iridium.webRTC,
    }
  },
  computed: {
    conversationId() {
      return this.webrtc.state.activeCall?.callId
    },
    participant() {
      return this.chat.getOtherParticipants(this.conversationId)[0]
    },
  },
  methods: {
    async navigateToActiveConversation() {
      if (!this.conversationId) {
        return
      }

      if (this.$device.isMobile) {
        // mobile, show slide 1 which is chat slide, set showSidebar flag false as css related
        this.$store.commit('ui/setSwiperSlideIndex', 1)
        this.$store.commit('ui/showSidebar', false)
      }

      this.$router.push(`/chat/${this.conversationId}`)
    },
  },
})
</script>

<style scoped lang="less" src="./PreviewCall.less"></style>
