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
    }),
  },
  async mounted() {
    const id = iridium.webRTC.state.activeCall?.callId

    if (!id || !iridium.chat?.hasConversation(id)) {
      return
    }

    const conversation = iridium.chat?.getConversation(id)

    this.caller = conversation?.participants.find((participant) => {
      return participant.peerId !== iridium.connector?.peerId
    })
  },
  methods: {
    async navigateToActiveConversation() {
      if (!this.caller) {
        return
      }

      if (this.$device.isMobile) {
        // mobile, show slide 1 which is chat slide, set showSidebar flag false as css related
        this.$store.commit('ui/setSwiperSlideIndex', 1)
        this.$store.commit('ui/showSidebar', false)
      }

      const id = await iridium.chat?.directConversationId(this.caller.did)

      if (!id || !(await iridium.chat?.hasConversation(id))) {
        return
      }

      this.$router.push(`/chat/${id}`)
    },
  },
})
</script>

<style scoped lang="less" src="./BackgroundCall.less"></style>
