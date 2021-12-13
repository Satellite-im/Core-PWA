<template src="./Global.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ModalWindows } from '~/store/ui/types'

declare module 'vue/types/vue' {
  interface Vue {
    toggleModal: (modalName: string) => void
  }
}

export default Vue.extend({
  name: 'Global',
  computed: {
    ...mapState(['ui', 'media']),
    ModalWindows: () => ModalWindows,
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

    // // A update which requires resetting of the app has occurred.
    if (lsMinorVersion !== minorVersion) {
      this.$data.requiresUpdate = true
      this.$data.hasMinorUpdate = true
    }

    // // A version which brings new features without major changes exists
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
    async acceptCall(hasVideo: boolean) {
      const identifier = this.$store.state.webrtc.incomingCall
      const peer = this.$WebRTC.getPeer(identifier)
      
      const streamConstraints = { audio: true, video: false }
      if (hasVideo) {
        // @ts-ignore
        streamConstraints.video = { 
          facingMode: 'user',
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(streamConstraints);

      peer?.call.answer(stream)

      if (hasVideo) {
        peer?.call.addTransceiver("video")
      }

      this.$store.dispatch('webrtc/acceptCall', { id: identifier, stream: stream})
    },
    /**
     * @method denyCall DocsTODO
     * @description
     * @example
     */
    denyCall() {
      const identifier = this.$store.state.webrtc.incomingCall
      const peer = this.$WebRTC.getPeer(identifier)

      peer?.send('SIGNAL', { type: 'CALL_DENIED' })
      this.$store.dispatch('webrtc/denyCall')
    },
  },
})
</script>
