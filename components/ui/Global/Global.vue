<template src="./Global.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { TrackKind } from '~/libraries/WebRTC/types'
import { ModalWindows } from '~/store/ui/types'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { Friend } from '~/types/ui/friends'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

declare module 'vue/types/vue' {
  interface Vue {
    toggleModal: (modalName: string) => void
  }
}

export default Vue.extend({
  name: 'Global',
  computed: {
    ...mapState(['ui', 'media', 'webrtc', 'conversation', 'files']),
    ...mapGetters('webrtc', ['isBackgroundCall', 'isActiveCall']),
    ModalWindows: () => ModalWindows,
    showBackgroundCall(): boolean {
      if (!this.$device.isMobile) {
        return this.isBackgroundCall
      }
      return this.isBackgroundCall || (this.isActiveCall && this.ui.showSidebar)
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
        await iridium.webRTC.acceptCall(kinds)
      } catch (error) {
        if (error instanceof Error) {
          this.$toast.error(this.$t(error.message) as string)
        }
      }

      const callId = iridium.webRTC.state.activeCall?.callId

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
      iridium.webRTC.denyCall()
    },
    /**
     * @method hangUp
     * @description Hangs up active call
     * @example
     */
    hangUp() {
      this.$store.commit('webrtc/setIncomingCall', undefined, { root: true })
      this.$store.commit('ui/fullscreen', false)
      iridium.webRTC.hangUp()
    },
  },
})
</script>
