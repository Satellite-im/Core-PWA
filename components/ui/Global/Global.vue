<template src="./Global.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { TrackKind } from '~/libraries/WebRTC/types'
import { ModalWindows } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { useWebRTC } from '~/libraries/Iridium/webrtc/hooks'
import { PropCommonEnum } from '~/libraries/Enums/enums'

declare module 'vue/types/vue' {
  interface Vue {
    toggleModal: (modalName: string) => void
  }
}

export default Vue.extend({
  name: 'Global',
  setup() {
    const { isActiveCall, isBackgroundCall } = useWebRTC()

    return { isActiveCall, isBackgroundCall }
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState(['ui', 'media', 'conversation', 'files', 'settings']),
    ModalWindows: () => ModalWindows,
    showBackgroundCall(): boolean {
      if (!this.$device.isMobile) {
        return this.isBackgroundCall
      }
      return this.isBackgroundCall || (this.isActiveCall && this.ui.showSidebar) // this.ui.isMobileNavVisible
    },
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
     * @method acceptCall DocsTODO
     * @description
     * @example
     */
    async acceptCall(kinds: TrackKind[]) {
      try {
        await iridium.webRTC.acceptCall(kinds)
      } catch (error) {
        if (error instanceof Error) {
          this.$toast.error(this.$t(error.message) as string)
        }
      }

      const callId = this.webrtc.activeCall?.callId
      if (!callId) {
        return
      }
      const callingPath = `${
        this.$device.isMobile ? '/mobile/chat/' : '/chat/'
      }${callId}`
      if (this.$route.path !== callingPath) {
        this.$router.push(callingPath)
      }
    },
    /**
     * @method denyCall DocsTODO
     * @description
     * @example
     */
    denyCall() {
      iridium.webRTC.denyCall()
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
