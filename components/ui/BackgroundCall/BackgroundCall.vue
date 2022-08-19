<template src="./BackgroundCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import {
  useCallElapsedTime,
  useUserStreams,
  useWebRTC,
} from '~/libraries/Iridium/webrtc/hooks'

export default Vue.extend({
  setup() {
    const { remoteParticipants, call } = useWebRTC()
    const { elapsedTime, startInterval, clearTimer } = useCallElapsedTime()

    const remoteParticipant = computed(() => {
      return remoteParticipants.value.length > 0
        ? remoteParticipants.value[0]
        : null
    })

    const { streams, getStream } = useUserStreams(remoteParticipant.value?.did)

    return {
      remoteParticipant,
      call,
      elapsedTime,
      startInterval,
      clearTimer,
      streams,
      audioStream: getStream('audio'),
    }
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
  },
  watch: {
    'webrtc.createdAt': {
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
    navigateToActiveConversation() {
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
