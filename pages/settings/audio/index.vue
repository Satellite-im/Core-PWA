<template src="./Audio.html"></template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { mapState } from 'vuex'
import { UserPermissions } from '../../../components/mixins/UserPermissions'
import { Bitrates, SampleSizes } from './options/audio'

export default mixins(UserPermissions).extend({
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
  methods: {
    async setupDefaults() {
      // @ts-ignore
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
      }

      if (permissionsObject.browser !== 'Chrome') {
        this.$data.browserAllowsAudioOut = false
      } else if (!this.settings.audioOutput) {
        this.isAudioOutput = permissionsObject.devices.audioOut[0].value
      }
    },
    async enableAudio() {
      // Check to see if the user has permission
      try {
        // @ts-ignore
        await this.requestUserPermissions('audio')
        this.$data.userHasGivenAudioAccess = true
        // @ts-ignore
        this.setupDefaults()
      } catch (_: any) {
        // Error is returned if user selects Block/Deny
        this.$data.userDeniedAudioAccess = true
      }
    },
  },
  mounted() {
    // Get the users permissions - if they had granted our origin access this will return granted, prompt, or denied.
    // @ts-ignore
    this.setupDefaults()
  },
})
</script>

<style lang="less" scoped src="./Audio.less"></style>
