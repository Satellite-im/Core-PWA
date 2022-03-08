<template src="./Live.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RadioIcon, XIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    RadioIcon,
    XIcon,
  },
  computed: {
    ...mapState(['ui', 'webrtc']),
    existLiveChat(): boolean {
      return this.$store.state.friends.all.some(
        (friend) => friend.address === this.$store.state.webrtc.activeCall,
      )
    },
    selUserName(): string {
      const sUser = this.$store.state.friends.all.find(
        (friend) => friend.address === this.$store.state.webrtc.activeCall,
      )
      return sUser?.name
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
      this.$store.commit('ui/fullscreen', false)
    },
    async call(kinds: TrackKind[]) {
      const activeFriend = this.$Hounddog.getActiveFriend(
        this.$store.state.friends,
      )
      if (!activeFriend) return
      const identifier = activeFriend.address
      if (!this.webrtc.connectedPeers.includes(identifier)) {
        await this.$store.dispatch('webrtc/createPeerConnection', identifier)
        if (!this.webrtc.connectedPeers.includes(identifier)) return
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
