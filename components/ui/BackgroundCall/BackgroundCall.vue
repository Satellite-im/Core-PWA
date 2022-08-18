<template src="./BackgroundCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Call, CallPeerStreams } from '~/libraries/WebRTC/Call'
import { WebRTCState } from '~/libraries/Iridium/webrtc/types'
import { useCallElapsedTime, useWebRTC } from '~/libraries/Iridium/webrtc/hooks'

export default Vue.extend({
  setup() {
    const { remoteParticipants, call } = useWebRTC()
    const { elapsedTime, startInterval, clearTimer } = useCallElapsedTime()

    const remoteParticipant = computed(() => {
      return remoteParticipants.value.length > 0
        ? remoteParticipants.value[0]
        : null
    })

    return { remoteParticipant, call, elapsedTime, startInterval, clearTimer }
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState({
      friends: (state) => (state as RootState).friends.all,
      deafened: (state) => (state as RootState).audio.deafened,
    }),
    createdAt(): WebRTCState['createdAt'] {
      return this.webrtc.createdAt
    },
    audioMuted(): boolean {
      if (!this.remoteParticipant) return true

      return this.webrtc.streamMuted[this.remoteParticipant.did].audio
    },
    streams(): CallPeerStreams | undefined {
      if (!this.remoteParticipant || !this.call) return

      return (this.call as Call).streams[this.remoteParticipant.did]
    },
    audioStream(): MediaStream | undefined {
      if (this.audioMuted || !this.call) return

      return (this.streams as CallPeerStreams)?.audio
    },
  },
  watch: {
    createdAt: {
      handler() {
        this.startInterval()
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    async navigateToActiveConversation() {
      if (!this.remoteParticipant) {
        return
      }

      if (this.$device.isMobile) {
        // mobile, show slide 1 which is chat slide, set showSidebar flag false as css related
        this.$store.commit('ui/showSidebar', false)
      }

      const id = iridium.chat?.directConversationIdFromDid(
        this.remoteParticipant.did,
      )

      if (!id || !iridium.chat?.hasConversation(id)) {
        return
      }

      this.$router.push(`/chat/${id}`)
    },
  },
})
</script>

<style scoped lang="less" src="./BackgroundCall.less"></style>
