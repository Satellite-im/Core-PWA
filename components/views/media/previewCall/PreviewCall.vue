<template src="./PreviewCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { CornerUpLeftIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    CornerUpLeftIcon,
  },
  props: {
    dragging: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  methods: {
    navigateToActiveConversation() {
      if (!this.webrtc.activeCall) {
        return
      }
      if (this.$device.isMobile) {
        // mobile, show slide 1 which is chat slide, set showSidebar flag false as css related
        this.$store.commit('ui/setSwiperSlideIndex', 1)
        this.$store.commit('ui/showSidebar', false)
      }
      this.$router.push(`/chat/${this.webrtc.activeCall.callId}`)
    },
  },
})
</script>

<style scoped lang="less" src="./PreviewCall.less"></style>
