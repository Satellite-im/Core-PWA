<template src="./Audio.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Bitrates, SampleSizes } from './options/audio'

export default Vue.extend({
  layout: 'settings',
  data() {
    return {
      Bitrates,
      SampleSizes,
      audioInputs: [],
      audioOutputs: [],
    }
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
