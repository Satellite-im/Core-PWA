<template src="./Call.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'
import {
  PhoneOutgoingIcon,
  PhoneIncomingIcon,
  PhoneOffIcon,
} from 'satellite-lucide-icons'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import {
  WebRTCActiveCall,
  WebRTCIncomingCall,
} from '~/libraries/Iridium/webrtc/types'
import { formatDuration } from '~/utilities/duration'

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
      callDuration: '',
    }
  },
  computed: {
    ...mapGetters({
      getTimestamp: 'settings/getTimestamp',
    }),
    isOutgoingCall(): boolean {
      return this.message.from === iridium.id
    },
    incomingName(): string {
      return (iridium.users.getUser(this.message.from) as User).name
    },
    startedAtTimestamp(): string {
      return this.getTimestamp({ time: this.message.at })
    },
    currentDuration() {
      return formatDuration(Date.now() - this.message.at)
    },
    incomingCall(): WebRTCIncomingCall | null {
      return this.webrtc.incomingCall
    },
    activeCall(): WebRTCActiveCall | null {
      return this.isLastCallMessage &&
        this.webrtc.activeCall?.callId === this.message.conversationId
        ? this.webrtc.activeCall
        : null
    },
  },
  watch: {
    webrtc: {
      handler() {
        this.callDuration = formatDuration(
          (Date.now() - this.webrtc.callStartedAt) / 1000,
        )
      },
      deep: true,
    },
  },
  methods: {
    hangUp() {
      iridium.webRTC.hangUp()
    },
  },
})
</script>

<style scoped lang="less" src="./Call.less"></style>
