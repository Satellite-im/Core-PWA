<template src="./BackgroundCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  data() {
    return {
      caller: null,
    }
  },
  computed: {
    ...mapState({
      showSettings: (state) => (state as RootState).ui.showSettings,
      friends: (state) => (state as RootState).friends.all,
      elapsedTime: (state) => (state as RootState).webrtc.elapsedTime,
      activeCall: (state) => (state as RootState).webrtc.activeCall,
    }),
  },
  async mounted() {
    const caller = await iridium.friends?.getFriend(this.activeCall?.callId)
    if (!caller) {
      return
    }
    this.caller = caller
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

      this.$router.push(`/chat/direct/${this.caller.did}`)
    },
  },
})
</script>

<style scoped lang="less" src="./BackgroundCall.less"></style>
