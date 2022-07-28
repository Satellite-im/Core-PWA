<template src="./Global.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { TrackKind } from '~/libraries/WebRTC/types'
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
      webrtc: iridium.webRTC,
    }
  },
  computed: {
    ...mapState(['ui', 'media', 'conversation', 'files']),
    ModalWindows: () => ModalWindows,
    incomingCall() {
      return this.webrtc.state.incomingCall
    },
    showBackgroundCall(): boolean {
      if (!this.$device.isMobile) {
        return this.webrtc.isBackgroundCall
      }
      return (
        this.webrtc.isBackgroundCall ||
        (this.webrtc.isActiveCall && this.ui.showSidebar)
      )
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
        await this.webrtc.acceptCall(kinds)
      } catch (error) {
        if (error instanceof Error) {
          this.$toast.error(this.$t(error.message) as string)
        }
      }

      const callId = this.webrtc.state.activeCall?.callId

      if (!callId) {
        return
      }

      const callingPath = `/chat/${callId}`

      if (this.$route.path !== callingPath) {
        this.$router.push(callingPath)
      }

      if (this.ui.showSettings) {
        this.$store.commit('ui/toggleSettings', { show: false })
      }
    },
    /**
     * @method denyCall DocsTODO
     * @description
     * @example
     */
    denyCall() {
      this.$store.commit('ui/fullscreen', false)
      this.webrtc.denyCall()
    },
    /**
     * @method hangUp
     * @description Hangs up active call
     * @example
     */
    hangUp() {
      this.$store.commit('ui/fullscreen', false)
      this.webrtc.hangUp()
    },
  },
})
</script>
