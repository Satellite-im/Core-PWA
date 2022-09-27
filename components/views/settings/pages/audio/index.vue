<template src="./Audio.html"></template>

<script lang="ts">
import Vue from 'vue'

import { mapState } from 'vuex'
import {
  Bitrates,
  SampleSizes,
} from '~/components/views/settings/pages/audio/options'
import { UserPermissions } from '~/components/mixins/UserPermissions'
import { CaptureMouseTypes } from '~/store/settings/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { AudioStreamUtils } from '~/utilities/AudioStreamUtils'

export default Vue.extend({
  name: 'AudioSettings',
  layout: 'settings',
  data() {
    return {
      Bitrates,
      SampleSizes,
      hasMicrophone: false,
      audioInputs: [],
      audioOutputs: [],
      hasWebcam: false,
      videoInputs: [],
      isListening: false,
      isLoadingTrack: false,
      userHasGivenAudioAccess: false,
      userDeniedAudioAccess: false,
      userHasGivenVideoAccess: false,
      userDeniedVideoAccess: false,
      browserAllowsAudioOut: true,
      micLevel: 0,
      stream: null as MediaStream | null,
      featureReadyToShow: false,
      updateInterval: null as NodeJS.Timer | null,
      captureMouses: [
        {
          value: CaptureMouseTypes.always,
          text: this.$i18n.t('pages.settings.always'),
        },
        {
          value: CaptureMouseTypes.motion,
          text: this.$i18n.t('pages.settings.motion'),
        },
        {
          value: CaptureMouseTypes.never,
          text: this.$i18n.t('pages.settings.never'),
        },
      ],
      iridiumSettings: iridium.settings.state,
      audioStreamUtils: null as AudioStreamUtils | null,
    }
  },
  computed: {
    ...mapState({
      settings: (state) => (state as RootState).settings,
      audio: (state) => (state as RootState).audio,
    }),
    // React to v-model changes to echoCancellation and update
    // the state accordingly with the mutation
    isEchoCancellation: {
      set(state: boolean) {
        this.$store.commit('settings/echoCancellation', state)
        this.setConstraint('echoCancellation', state)
      },
      get(): boolean {
        return this.settings.echoCancellation
      },
    },
    isNoiseSuppression: {
      set(state: boolean) {
        this.$store.commit('settings/noiseSuppression', state)
        this.setConstraint('noiseSuppression', state)
      },
      get(): boolean {
        return this.settings.noiseSuppression
      },
    },
    isBitrate: {
      set(state: number) {
        this.$store.commit('settings/bitrate', state)
        this.setConstraint('sampleRate', state)
      },
      get(): number {
        return this.settings.bitrate
      },
    },
    isSampleSize: {
      set(state: number) {
        this.$store.commit('settings/sampleSize', state)
        this.setConstraint('sampleSize', state)
      },
      get(): number {
        return this.settings.sampleSize
      },
    },
    selectedAudioInput: {
      set(state: string) {
        this.$store.commit('settings/audioInput', state)
      },
      get(): string {
        return this.settings.audioInput
      },
    },
    selectedAudioOutput: {
      set(state: string) {
        this.$store.commit('settings/audioOutput', state)
        this.setConstraint('volume', state)
      },
      get(): string {
        return this.settings.audioOutput
      },
    },
    isVideoInput: {
      set(state) {
        this.$store.commit('settings/videoInput', state)
      },
      get(): string {
        return this.settings.videoInput
      },
    },
    isCaptureMouse: {
      set(state: string) {
        this.$store.commit('settings/captureMouse', state)
      },
      get(): string {
        return this.settings.captureMouse
      },
    },
    flipVideo: {
      set(value: boolean) {
        iridium.settings.set('/video/flipLocalStream', value)
      },
      get(): boolean {
        return this.iridiumSettings.video.flipLocalStream
      },
    },
  },
  watch: {
    async '$store.state.settings.audioInput'(newValue, oldValue) {
      // If there is an oldValue in the persisted state
      if (oldValue !== '') {
        // Close old MediaStream
        if (this.stream) {
          this.stream
            .getAudioTracks()
            .forEach(function (track: MediaStreamTrack) {
              track.stop()
            })
        }
        // Open new MediaStream
        const stream = await this.requestUserPermissions({
          audio: { deviceId: newValue },
        })
        this.updateStream(stream)
      }
    },
    stream(stream) {
      this.audioStreamUtils?.destroy()
      if (!stream) {
        this.micLevel = 0
        return
      }
      this.audioStreamUtils = new AudioStreamUtils(stream, this.audio)
      this.audioStreamUtils.start()
    },
    'audioStreamUtils.level'(level) {
      this.micLevel = Math.round(level)
    },
  },
  mounted() {
    // Check for new input sources
    this.setupDefaults()
    this.updateInterval = setInterval(this.setupDefaults, 1000)
  },
  beforeDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    this.stopListening()
  },
  methods: {
    ...UserPermissions.methods,
    /**
     * @method setupMicMeter DocsTODO
     * @description
     * @param stream
     * @example
     */
    updateStream(stream: MediaStream) {
      this.stream = stream
    },
    /**
     * @method setupDefaults DocsTODO
     * @description
     * @example
     */
    async setupDefaults() {
      const permissionsObject = await this.getUserPermissions()

      // Toggles the show/hide on the button to request permissions
      this.userHasGivenAudioAccess = permissionsObject.permissions.microphone
      if (permissionsObject.permissions.microphone) {
        this.userDeniedAudioAccess = false
      }
      this.userHasGivenVideoAccess = permissionsObject.permissions.webcam
      if (permissionsObject.permissions.webcam) {
        this.userDeniedVideoAccess = false
      }
      this.hasMicrophone = permissionsObject.hasMicrophone
      this.hasWebcam = permissionsObject.hasWebcam

      if (permissionsObject.permissions.microphone) {
        // Get the arrays of devices formtted in the name/value format the select tool wants
        this.audioInputs = permissionsObject.devices.audioIn
        this.audioOutputs = permissionsObject.devices.audioOut

        // Setting defaults on mount if one isn't already present in local storage
        if (!this.settings.audioInput) {
          this.selectedAudioInput = permissionsObject.devices.audioIn[0]?.value // chrome, ffx, and safari all support the audioIn object
        }
        if (!this.settings.audioOutput) {
          this.selectedAudioOutput =
            permissionsObject.devices.audioOut[0]?.value
        }
      }

      if (permissionsObject.permissions.webcam) {
        this.videoInputs = permissionsObject.devices.videoIn
        this.userHasGivenVideoAccess = permissionsObject.permissions.webcam
        if (!this.settings.videoInput) {
          this.isVideoInput = permissionsObject.devices.videoIn[0]?.value
        }
      }

      if (permissionsObject.browser !== 'Chrome') {
        this.browserAllowsAudioOut = false
      } else if (!this.settings.audioOutput) {
        this.selectedAudioOutput =
          permissionsObject.devices.audioOut[0]?.value || ''
      }
    },
    async startListening() {
      this.isLoadingTrack = true
      this.stream = await this.requestUserPermissions({
        audio: { deviceId: this.settings.audioInput },
      })
      this.isLoadingTrack = false
      this.isListening = true
    },
    async stopListening() {
      this.stream?.getAudioTracks().forEach((track: MediaStreamTrack) => {
        track.stop()
      })
      this.isListening = false
    },
    /**
     * @method enableAudio DocsTODO
     * @description
     * @example
     */
    async enableAudio() {
      // Check to see if the user has permission
      try {
        this.stream = await this.requestUserPermissions({ audio: true })
        this.userHasGivenAudioAccess = true
        this.setupDefaults()
      } catch (_: any) {
        // Error is returned if user selects Block/Deny
        this.userDeniedAudioAccess = true
      }
    },
    /**
     * @method enableAudio DocsTODO
     * @description
     * @example
     */
    async enableVideo() {
      // Check to see if the user has permission
      try {
        await this.requestUserPermissions({ video: true })
        this.userHasGivenVideoAccess = true
        this.setupDefaults()
      } catch (_: any) {
        // Error is returned if user selects Block/Deny
        this.userDeniedVideoAccess = true
      }
    },
    /**
     * @method volumeControlValueChange DocsTODO
     * @description
     * @param volume
     * @example
     */
    volumeControlValueChange(volume: number) {
      this.$Sounds.changeLevels(volume / 100)
      this.$store.commit('audio/setVolume', volume)
    },
    /**
     * @method systemVolumeControlValueChange DocsTODO
     * @description
     * volume change will effect notification and other system sounds
     * @param volume
     * @example
     */
    systemVolumeControlValueChange(volume: number) {
      this.$Sounds.changeLevels(volume / 100)
      this.$store.commit('audio/setSystemVolume', volume)
    },
    /**
     * @method inputVolumeControlValueChange DocsTODO
     * @description
     * @param volume
     * @example
     */
    inputVolumeControlValueChange(volume: number) {
      this.$store.commit('audio/setInputVolume', volume)
    },
    /**
     * @method hasConstraint DocsTODO
     * @description
     * @param prop
     * @returns
     * @example
     */
    hasConstraint(prop: keyof MediaTrackConstraintSet): boolean {
      const supports = navigator.mediaDevices.getSupportedConstraints()
      return prop in supports
    },
    /**
     * @method setContraint DocsTODO
     * @description
     * @param prop
     * @param value
     * @returns
     * @example
     */
    setConstraint(
      prop: keyof MediaTrackConstraintSet,
      value: string | number | boolean,
    ) {
      // hasConstraint is true only if the prop is supported by the browser
      if (!this.hasConstraint(prop)) {
        return
      }
      if (this.userHasGivenAudioAccess && this.stream) {
        this.stream.getAudioTracks().forEach((track: MediaStreamTrack) => {
          const constraints = track.getConstraints()
          constraints[prop] = value
          track.applyConstraints(constraints)
        })
      }
    },
  },
})
</script>

<style lang="less" scoped src="./Audio.less"></style>
