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
        (friend) => friend.peerId === this.$store.state.webrtc.activeCall,
      )
    },
    selUserName(): string {
      const sUser = this.$store.state.friends.all.find(
        (friend) => friend.peerId === this.$store.state.webrtc.activeCall,
      )
      return sUser?.name
    },
  },
  methods: {
    hangUp() {
      if (!this.webrtc.activeCall) return
      this.$store.dispatch('webrtc/hangUp')
    },
    activeChat() {
      this.$store.commit('ui/fullscreen', false)
    },
    async call(kinds: TrackKind[]) {
      await this.$store.dispatch('webrtc/call', { kinds })
    },
  },
})
</script>

<style scoped lang="less" src="./Live.less"></style>
