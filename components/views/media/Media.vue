<template src="./Media.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { User } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  props: {
    users: {
      type: Array as PropType<Array<User>>,
      default: () => [],
    },
    maxViewableUsers: {
      type: Number,
      default: 0,
      required: true,
    },
    fullscreenMaxViewableUsers: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
      isFullscreen: false,
    }
  },
  computed: {
    ...mapState({
      callHeight: (state) => (state as RootState).ui.callHeight,
      volume: (state) => (state as RootState).audio.volume,
    }),
    localParticipant(): User | undefined {
      const p = iridium.webRTC.localParticipant()
      console.info('localParticipant', p)
      return p
    },
    remoteParticipants(): User[] {
      const p = iridium.webRTC.remoteParticipants()
      console.info('remoteParticipants', p)
      return p
    },
    height: {
      get(): string {
        return this.callHeight
      },
      set(value) {
        this.$store.commit('ui/setCallHeight', value)
      },
    },
  },
  methods: {
    /**
     * @method volumeControlValueChange DocsTODO
     * @description Changes volume by setting new value using $Sounds.changeLevels and committing new value to setVolume in state
     * @param volume New volume level
     * @example
     */
    volumeControlValueChange(volume: number) {
      this.$Sounds.changeLevels(volume / 100)
      this.$store.commit('audio/setVolume', volume)
    },
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        const media = this.$refs.mediastream as HTMLElement
        media.requestFullscreen()
        this.isFullscreen = true
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
        this.isFullscreen = false
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Media.less"></style>
