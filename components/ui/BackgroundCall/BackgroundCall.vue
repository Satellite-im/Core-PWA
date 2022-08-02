<template src="./BackgroundCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Friend } from '~/types/ui/friends'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  computed: {
    ...mapState({
      friends: (state) => (state as RootState).friends.all,
      elapsedTime: (state) => (state as RootState).webrtc.elapsedTime,
      activeCall: (state) => (state as RootState).webrtc.activeCall,
    }),
    caller(): Friend | undefined {
      return this.friends.find(
        (f: Friend) => f.peerId === this.activeCall?.peerId,
      )
    },
  },
  methods: {
    navigateToActiveConversation() {
      if (!this.caller) {
        return
      }

      if (this.$device.isMobile) {
        // mobile, show slide 1 which is chat slide, set showSidebar flag false as css related
        this.$store.commit('ui/showSidebar', false)
      }

      this.$store.dispatch('conversation/setConversation', {
        id: this.caller.peerId,
        type: 'friend',
        participants: [this.caller],
        calling: false,
      })

      this.$router.push(`/chat/direct/${this.caller.address}`)
    },
  },
})
</script>

<style scoped lang="less" src="./BackgroundCall.less"></style>
