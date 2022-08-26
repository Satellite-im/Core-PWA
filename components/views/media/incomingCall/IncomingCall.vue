<template src="./IncomingCall.html"></template>

<script lang="ts">
import Vue from 'vue'

import {
  PhoneIcon,
  PhoneOffIcon,
  VideoIcon,
  VideoOffIcon,
} from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/friends/types'
import { WebRTCState } from '~/libraries/Iridium/webrtc/types'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  name: 'IncomingCall',
  components: {
    PhoneIcon,
    PhoneOffIcon,
    VideoIcon,
    VideoOffIcon,
  },
  props: {
    acceptCall: {
      type: Function,
      default: () => {},
      required: false,
    },
    denyCall: {
      type: Function,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    conversationId(): Conversation['id'] | undefined {
      return this.incomingCall?.did
    },
    conversation(): Conversation | undefined {
      if (!this.conversationId) {
        return undefined
      }
      return iridium.chat.state.conversations[this.conversationId]
    },
    isGroup(): boolean {
      return this.conversation?.type === 'group'
    },
    incomingCall(): WebRTCState['incomingCall'] {
      return this.webrtc.incomingCall
    },
    caller(): User | undefined {
      if (!this.conversationId) {
        return
      }
      // TODO : fix this later
      if (this.isGroup) {
        return
      }
      return iridium.users.getUser(this.conversationId)
    },
    callerAvatar(): string {
      if (!this.caller) {
        return ''
      }
      const hash = this.caller.photoHash
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
  },
})
</script>

<style scoped lang="less" src="./IncomingCall.less"></style>
