<template src="./BackgroundCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  data() {
    return {
      caller: null,
      webrtc: iridium.webRTC.state,
      interval: null,
      elapsedTime: '',
    }
  },
  computed: {
    ...mapState({
      showSettings: (state) => (state as RootState).ui.showSettings,
      friends: (state) => (state as RootState).friends.all,
    }),
    activeCall() {
      return this.webrtc.activeCall
    },
    createdAt() {
      return this.webrtc.createdAt
    },
  },
  watch: {
    createdAt() {
      this.startInterval()
    },
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  async mounted() {
    this.startInterval()

    const id = this.activeCall?.callId

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

      const id = await iridium.chat?.directConversationIdFromDid(
        this.caller.did,
      )

      if (!id || !(await iridium.chat?.hasConversation(id))) {
        return
      }

      this.$router.push(`/chat/${id}`)
    },
    startInterval() {
      if (!this.interval && this.createdAt && this.activeCall) {
        this.interval = setInterval(this.updateElapsedTime, 1000)
      }
    },
    updateElapsedTime() {
      const duration = dayjs.duration(Date.now() - this.createdAt)
      const hours = duration.hours()
      this.elapsedTime = `${hours > 0 ? hours + ':' : ''}${duration.format(
        'mm:ss',
      )}`
    },
  },
})
</script>

<style scoped lang="less" src="./BackgroundCall.less"></style>
