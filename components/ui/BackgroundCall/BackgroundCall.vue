<template src="./BackgroundCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['conversation', 'friends']),
    ...mapState('webrtc', ['elapsedTime', 'activeCall']),
    ...mapGetters('webrtc', ['isBackgroundCall']),
    caller() {
      return this.friends.all.find(
        (f: any) => f.peerId === this.activeCall?.callId,
      )
    },
  },
  methods: {
    navigateToActiveConversation() {
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
