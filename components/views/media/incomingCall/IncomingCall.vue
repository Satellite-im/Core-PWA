<template src="./IncomingCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  PhoneIcon,
  PhoneOffIcon,
  VideoIcon,
  VideoOffIcon,
} from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { WebRTCState } from '~/libraries/Iridium/webrtc/types'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { TrackKind } from '~/libraries/WebRTC/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'IncomingCall',
  components: {
    PhoneIcon,
    PhoneOffIcon,
    VideoIcon,
    VideoOffIcon,
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
      chat: iridium.chat.state,
    }
  },
  computed: {
    ...mapState({
      audio: (state) => (state as RootState).audio,
    }),
    conversationId(): Conversation['id'] | undefined {
      return this.incomingCall?.did
    },
    conversation(): Conversation | undefined {
      if (!this.conversationId) {
        return undefined
      }
      return this.chat.conversations[this.conversationId]
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
  methods: {
    /**
     * @method acceptCall DocsTODO
     * @description
     * @example
     */
    async acceptCall() {
      const conversationId = this.webrtc.incomingCall?.callId
      if (!conversationId) {
        return
      }
      const kinds = [] as TrackKind[]
      if (!this.audio.muted) {
        kinds.push('audio')
      }
      this.$store.commit('video/setDisabled', true)
      await iridium.webRTC
        .acceptCall(kinds)
        .catch((e) => this.$toast.error(this.$t(e.message) as string))

      this.$router.push(
        this.$device.isMobile
          ? `/mobile/chat/${conversationId}`
          : `/chat/${conversationId}`,
      )
    },
    /**
     * @method denyCall DocsTODO
     * @description
     * @example
     */
    denyCall() {
      iridium.webRTC.denyCall()
    },
  },
})
</script>

<style scoped lang="less" src="./IncomingCall.less"></style>
