<template src="./Actions.html"></template>

<script lang="ts">
import Vue from 'vue'

import {
  VideoIcon,
  MicIcon,
  MonitorIcon,
  PhoneOffIcon,
  // @ts-ignore
} from 'vue-feather-icons'

import { mapState } from 'vuex'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

export default Vue.extend({
  components: {
    VideoIcon,
    MicIcon,
    MonitorIcon,
    PhoneOffIcon,
  },
  computed: {
    ...mapState(['audio', 'video']),
  },
  methods: {
    toggleMute() {
      const muted = this.audio.muted
      if (!muted) this.$Sounds.playSound(Sounds.MUTE)
      else this.$Sounds.playSound(Sounds.UNMUTE)

      this.$store.commit('mute')
    },
    toggleVideo() {
      const videoDisabled = this.video.disabled
      if (!videoDisabled) this.$Sounds.playSound(Sounds.DEAFEN)
      else this.$Sounds.playSound(Sounds.UNDEAFEN)

      this.$store.commit('toggleCamera')
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
