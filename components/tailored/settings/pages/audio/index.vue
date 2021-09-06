<template src="./Audio.html"></template>

<script lang="ts">
import Vue from 'vue'

import { mapState } from 'vuex'
import { Bitrates, SampleSizes } from './options/audio'
import {
  PermissionRequestOptions,
  UserPermissions,
} from '~/components/mixins/UserPermissions'

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    settings: any
    setupDefaults: () => void
    getUserPermissions: () => Promise<any>
    requestUserPermissions: (key: PermissionRequestOptions) => Promise<any>
    getMicLevel: (stream: MediaStream) => void
    setupMicMeter: (stream: MediaStream) => void
  }
}
export default Vue.extend({
  name: 'AudioSettings',
  layout: 'settings',
  data() {
    return {
      Bitrates,
      SampleSizes,
      audioInputs: [],
      audioOutputs: [],
      userHasGivenAudioAccess: false,
      userDeniedAudioAccess: false,
      browserAllowsAudioOut: true,
      micLevel: 0,
      stream: null,
      updateInterval: null,
    }
  },
  computed: {
    ...mapState(['settings', 'audio']),
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
    isNoiseSuppression: {
      set(state) {
        this.$store.commit('noiseSuppression', state)
      },
      get() {
        return this.settings.noiseSuppression
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
    isAudioInput: {
      set(state) {
        this.$store.commit('audioInput', state)
      },
      get() {
        return this.settings.audioInput
      },
    },
    isAudioOutput: {
      set(state) {
        this.$store.commit('audioOutput', state)
      },
      get() {
        return this.settings.audioOutput
      },
    },
  },
  watch: {
    async '$store.state.settings.audioInput'(newValue, oldValue) {
      // If there is an oldValue in the persisted state
      if (oldValue !== '') {
        // Close old MediaStream
        if (this.$data.stream) {
          this.$data.stream
            .getAudioTracks()
            .forEach(function (track: MediaStreamTrack) {
              track.stop()
            })
        }

        // Open new MediaStream
        const stream = await this.requestUserPermissions({
          audio: { deviceId: newValue },
        })
        this.setupMicMeter(stream)
      }
    },
  },
  mounted() {
    // Check for new input sources
    this.$data.updateInterval = setInterval(this.setupDefaults, 1000)
  },
  beforeDestroy() {
    if (this.$data.stream) {
      this.$data.stream
        .getAudioTracks()
        .forEach(function (track: MediaStreamTrack) {
          track.stop()
        })
    }
    clearInterval(this.$data.updateInterval)
  },
  methods: {
    ...UserPermissions.methods,
    getMicLevel(stream: MediaStream) {
      const audioContext = new AudioContext()
      const gainNode = audioContext.createGain()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

      analyser.smoothingTimeConstant = 0

      microphone.connect(gainNode)
      gainNode.connect(analyser)
      analyser.connect(javascriptNode)
      javascriptNode.connect(audioContext.destination)

      const array = new Uint8Array(analyser.frequencyBinCount)

      const draw = () => {
        // Update gain based on inputVolume
        gainNode.gain.setValueAtTime(
          this.$store.state.audio.inputVolume / 100,
          audioContext.currentTime
        )
        requestAnimationFrame(draw)

        analyser.getByteFrequencyData(array)
        let values = 0

        const length = array.length
        for (let i = 0; i < length; i++) {
          values += array[i]
        }

        const average = values / length

        // The micLevel can range between 0 and 100 approximately
        this.$data.micLevel = Math.round(average)
      }

      draw()
    },
    setupMicMeter(stream: MediaStream) {
      this.$data.stream = stream
      this.getMicLevel(stream)
    },
    async setupDefaults() {
      const permissionsObject: any = await this.getUserPermissions()

      // Toggles the show/hide on the button to request permissions
      this.$data.userHasGivenAudioAccess =
        permissionsObject.permissions.microphone

      if (permissionsObject.permissions.microphone) {
        // Get the arrays of devices formtted in the name/value format the select tool wants
        this.$data.audioInputs = permissionsObject.devices.audioIn
        this.$data.audioOutputs = permissionsObject.devices.audioOut

        // Setting defaults on mount if one isn't already present in local storage
        if (!this.settings.audioInput) {
          this.isAudioInput = permissionsObject.devices.audioIn[0].value // chrome, ffx, and safari all support the audioIn object
        }
        if (!this.settings.audioOutput) {
          this.isAudioOutput = permissionsObject.devices.audioOut[0].value
        }

        if (!this.$data.stream) {
          const stream = await this.requestUserPermissions({
            audio: { deviceId: this.$store.state.settings.audioInput },
          })
          this.setupMicMeter(stream)
        }
      }

      if (permissionsObject.browser !== 'Chrome') {
        this.$data.browserAllowsAudioOut = false
      } else if (!this.settings.audioOutput) {
        this.isAudioOutput = permissionsObject.devices.audioOut[0]?.value || ''
      }
    },
    async enableAudio() {
      // Check to see if the user has permission
      try {
        const stream = await this.requestUserPermissions({ audio: true })
        this.setupMicMeter(stream)
        this.$data.userHasGivenAudioAccess = true
        this.setupDefaults()
      } catch (_: any) {
        // Error is returned if user selects Block/Deny
        this.$data.userDeniedAudioAccess = true
      }
    },
    volumeControlValueChange(volume: number) {
      this.$Sounds.changeLevels(volume / 100)
      this.$store.commit('setVolume', volume)
    },
    inputVolumeControlValueChange(volume: number) {
      this.$store.commit('setInputVolume', volume)
    },
  },
})
</script>

<style lang="less" scoped src="./Audio.less"></style>
