<template src="./Direction.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  PhoneOutgoingIcon,
  PhoneIncomingIcon,
  PhoneOffIcon,
} from 'satellite-lucide-icons'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { WebRTCActiveCall } from '~/libraries/Iridium/webrtc/types'

export default Vue.extend({
  components: {
    PhoneOutgoingIcon,
    PhoneIncomingIcon,
    PhoneOffIcon,
  },
  props: {
    message: {
      type: Object as PropType<ConversationMessage>,
      required: true,
    },
    isLastCallMessage: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    isOutgoingCall(): boolean {
      return this.message.from === iridium.id
    },
    activeCall(): WebRTCActiveCall | null {
      return this.isLastCallMessage &&
        this.webrtc.activeCall?.callId === this.message.conversationId
        ? this.webrtc.activeCall
        : null
    },
  },
})
</script>

<style scoped lang="less" src="./Direction.less"></style>
