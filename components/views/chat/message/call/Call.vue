<template src="./Call.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
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
import { getTimestamp } from '~/utilities/timestamp'
import { webrtcHooks } from '~/components/compositions/webrtc'

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
  setup() {
    const { updateDuration } = webrtcHooks()

    return {
      updateDuration,
    }
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
      callDuration: '',
      timestampInterval: undefined as undefined | NodeJS.Timer,
    }
  },
  computed: {
    isOutgoingCall(): boolean {
      return this.message.from === iridium.id
    },
    incomingName(): string {
      return (iridium.users.getUser(this.message.from) as User).name
    },
    startedAtTimestamp(): string {
      return getTimestamp(this.message.at)
    },
    currentDuration(): string {
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
  created() {
    this.updateLocalDuration()
    this.timestampInterval = setInterval(() => {
      this.updateLocalDuration()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timestampInterval)
  },
  methods: {
    hangUp() {
      iridium.webRTC.hangUp()
    },
    updateLocalDuration() {
      this.callDuration = this.updateDuration(this.webrtc.callStartedAt)
    },
  },
})
</script>

<style scoped lang="less" src="./Call.less"></style>
