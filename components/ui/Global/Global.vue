<template src="./Global.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { TrackKind } from '~/libraries/WebRTC/types'
import { ModalWindows } from '~/store/ui/types'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Peer2Peer } from '~/libraries/WebRTC/Libp2p'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { Friend } from '~/types/ui/friends'

const p2p = Peer2Peer.getInstance()

declare module 'vue/types/vue' {
  interface Vue {
    toggleModal: (modalName: string) => void
  }
}

export default Vue.extend({
  name: 'Global',
  computed: {
    ...mapState(['ui', 'media', 'webrtc', 'conversation']),
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
      this.$store.commit('webrtc/setStreamMuted', {
        peerId: p2p.id,
        audio: true,
        video: true,
        screen: true,
      })
      const { callId, peerId } = this.webrtc.incomingCall
      const call = $WebRTC.getCall(callId)
      if (!call) {
        return
      }

      const redirectId =
        this.webrtc.incomingCall.type === 'group'
          ? `groups/${callId}`
          : `direct/${
              this.$store.state.friends.all.find(
                (f: Friend) => f.peerId === peerId,
              )?.address || 'error'
            }`

      try {
        await call.createLocalTracks(kinds)
        await call.answer(peerId)
      } catch (error) {
        if (error instanceof Error) {
          this.$toast.error(this.$t(error.message) as string)
        }
      }

      const callingPath = `/chat/${redirectId}`
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
      this.$store.dispatch('webrtc/denyCall')
    },
    /**
     * @method hangUp
     * @description Hangs up active call
     * @example
     */
    hangUp() {
      this.$store.commit('webrtc/setIncomingCall', undefined, { root: true })
      this.$store.commit('ui/fullscreen', false)
      this.$store.dispatch('webrtc/hangUp')
    },
  },
})
</script>
