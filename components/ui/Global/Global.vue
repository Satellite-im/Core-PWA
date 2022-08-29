<template src="./Global.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ModalWindows } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'

declare module 'vue/types/vue' {
  interface Vue {
    toggleModal: (modalName: string) => void
  }
}

export default Vue.extend({
  name: 'Global',
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState(['ui', 'media', 'conversation', 'files', 'settings']),
    ModalWindows: () => ModalWindows,
    incomingCall() {
      console.info('incomingCall', this.webrtc.incomingCall)
      return this.webrtc.incomingCall
    },
    isBackgroundCall(): boolean {
      return iridium.webRTC.isBackgroundCall(this.$route.params.id)
    },
    isActiveCall(): boolean {
      return iridium.webRTC.isActiveCall(this.$route.params.id)
    },
    showBackgroundCall(): boolean {
      if (!this.$device.isMobile) {
        return this.isBackgroundCall
      }
      return this.isBackgroundCall || (this.isActiveCall && this.ui.showSidebar)
  },
  watch: {
    'settings.audioInput'(audioInput: string) {
      this.updateWebRTCState({ audioInput })
    },
    'settings.videoInput'(videoInput: string) {
      this.updateWebRTCState({ videoInput })
    },
  },
  mounted() {
    // This determines if we should show the
    let lsVersion = localStorage.getItem('local-version')

    if (!lsVersion) {
      localStorage.setItem('local-version', this.$config.clientVersion)
      lsVersion = this.$config.clientVersion
      return
    }

    const [majorVersion, minorVersion, patchVersion] =
      this.$config.clientVersion.split('.')
    const [lsMajorVersion, lsMinorVersion, lsPatchVersion] =
      lsVersion.split('.')

    // A update which requires resetting of the app has occurred.
    if (lsMinorVersion !== minorVersion) {
      this.$data.requiresUpdate = true
      this.$data.hasMinorUpdate = true
    }

    // A version which brings new features without major changes exists
    if (lsPatchVersion !== patchVersion) {
      this.$data.hasMinorUpdate = true
    }

    if (this.$config.clientVersion !== lsVersion) {
      this.toggleModal('changelog')
      localStorage.setItem('local-version', this.$config.clientVersion)
    }

    const { audioInput, videoInput } = this.settings
    this.updateWebRTCState({ audioInput, videoInput })
  },
  methods: {
    /**
     * @method toggleModal
     * @description
     * @example
     */
    toggleModal(modalName: keyof ModalWindows): void {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
    /**
     * @method updateWebRTCState
     * @description Updates the WebRTC state with the given settings.
     * @example this.updateWebRTCState({ audioInput: 'default', videoInput: 'default' })
     */
    updateWebRTCState({
      audioInput,
      videoInput,
    }: {
      audioInput?: string
      videoInput?: string
    }) {
      const streamConstraints = {} as MediaStreamConstraints

      if (audioInput && audioInput !== PropCommonEnum.DEFAULT) {
        streamConstraints.audio = { deviceId: audioInput }
      }
      if (videoInput && videoInput !== PropCommonEnum.DEFAULT) {
        streamConstraints.video = { deviceId: videoInput }
      }

      iridium.webRTC.streamConstraints = streamConstraints
    },
  },
})
</script>
