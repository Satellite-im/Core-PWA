<template src="./Audio.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Bitrates, SampleSizes } from './options/audio'

export default Vue.extend({
  name: 'AudioSettings',
  layout: 'settings',
  data() {
    return {
      Bitrates,
      SampleSizes,
      audioInputs: [],
      audioOutputs: [],
    }
  },
  computed: {
    ...mapState(['settings']),
    // React to v-model changes to echoCancellation and update
    // the state accordingly with the mutation
    isEchoCancellation: {
      set(state) {
        this.$store.commit('echoCancellation', state)
      },
      get() {
        return this.settings.echoCancellation
      },
    },
    isBitrate: {
      set(state) {
        this.$store.commit('bitrate', state)
      },
      get() {
        return this.settings.bitrate
      },
    },
    isSampleSize: {
      set(state) {
        this.$store.commit('sampleSize', state)
      },
      get() {
        return this.settings.sampleSize
      },
    },
  },
  mounted() {
    // TODO: Request permissions fist
    window.navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices.forEach((device) => {
        switch (device.kind) {
          case 'audioinput':
            this.$data.audioInputs.push({
              text: device.label,
              value: device.deviceId,
            })
            break
          case 'audiooutput':
            this.$data.audioOutputs.push({
              text: device.label,
              value: device.deviceId,
            })
            break
          default:
            break
        }
      })
    })
  },
})
</script>

<style lang="less" scoped src="./Audio.less"></style>
