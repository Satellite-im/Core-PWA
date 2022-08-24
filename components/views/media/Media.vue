<template src="./Media.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { User } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { useWebRTC } from '~/libraries/Iridium/webrtc/hooks'
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
  setup() {
    const { localParticipant, remoteParticipants } = useWebRTC()

    return { localParticipant, remoteParticipants }
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState({
      callHeight: (state) => (state as RootState).ui.callHeight,
      volume: (state) => (state as RootState).audio.volume,
    }),
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
  },
})
</script>

<style scoped lang="less" src="./Media.less"></style>
