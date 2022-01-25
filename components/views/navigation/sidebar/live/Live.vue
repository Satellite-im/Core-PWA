<template src="./Live.html" />

<script lang="ts">
import { RadioIcon, XIcon } from 'satellite-lucide-icons'
import { mapState } from 'vuex'

import Vue from 'vue'

export default Vue.extend({
  components: {
    RadioIcon,
    XIcon,
  },
  computed: {
    ...mapState(['ui', 'webrtc']),
    existLiveChat(): Boolean {
      return this.$store.state.friends.all.find(
        (friend) => friend.address === this.$store.state.webrtc.activeCall,
      )
    },
  },
  methods: {
    hangUp() {
      const peer = this.$WebRTC.getPeer(this.webrtc.activeCall)
      peer?.call.hangUp()
      this.$store.dispatch('webrtc/hangUp')
      this.$store.commit('ui/fullscreen', false)
    },
    activeChat() {
      this.call(['audio'])
    },
    async call(kinds: TrackKind[]) {
      const activeFriend = this.$Hounddog.getActiveFriend(
        this.$store.state.friends,
      )
      if (!activeFriend) return
      const identifier = activeFriend.address

      if (!this.webrtc.connectedPeer) {
        await this.$store.dispatch('webrtc/createPeerConnection', identifier)
        if (!this.webrtc.connectedPeer) return
      }

      // Trying to call the same user while call is already active
      if (identifier === this.$store.state.webrtc.activeCall) {
        return
      }

      const peer = this.$WebRTC.getPeer(identifier)

      const tracks = await peer?.call.createLocalTracks(kinds)

      await peer?.call.start()
    },
  },
})
</script>

<style scoped lang="less" src="./Live.less"></style>
