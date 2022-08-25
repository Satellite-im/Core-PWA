<template src="./PreviewCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { CornerUpLeftIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { useWebRTC } from '~/libraries/Iridium/webrtc/hooks'

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
  setup() {
    const { remoteParticipants } = useWebRTC()

    const remoteParticipant = computed(() => {
      return remoteParticipants.value.length > 0
        ? remoteParticipants.value[0]
        : null
    })

    return { remoteParticipant }
  },
  methods: {
    navigateToActiveConversation() {
      if (!iridium.webRTC.state.activeCall?.callId) {
        return
      }
      if (this.$device.isMobile) {
        this.$store.commit('ui/showSidebar', false)
      }
      this.$router.push(
        `${this.$device.isMobile ? '/mobile/chat/' : '/chat/'}${
          iridium.webRTC.state.activeCall.callId
        }`,
      )
    },
  },
})
</script>

<style scoped lang="less" src="./PreviewCall.less"></style>
