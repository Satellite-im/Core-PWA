<template src="./BackgroundCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { Friend } from '~/types/ui/friends'

export default Vue.extend({
  computed: {
    ...mapState(['conversation', 'friends']),
    ...mapState('webrtc', ['elapsedTime', 'activeCall']),
    caller(): Friend | undefined {
      return this.friends.all.find(
        (f: Friend) => f.peerId === this.activeCall?.callId,
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
        this.$store.commit('ui/setSwiperSlideIndex', 1)
        this.$store.commit('ui/showSidebar', false)
      }

      this.$store.dispatch('conversation/setConversation', {
        id: this.caller.address,
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
