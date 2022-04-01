<template src="./Global.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { TrackKind } from '~/libraries/WebRTC/types'
import { ModalWindows } from '~/store/ui/types'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'

declare module 'vue/types/vue' {
  interface Vue {
    toggleModal: (modalName: string) => void
  }
}

export default Vue.extend({
  name: 'Global',
  computed: {
    ...mapState(['ui', 'media', 'webrtc']),
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
      if (this.webrtc.activeCall) {
        this.hangUp()
      }

      const identifier = this.webrtc.incomingCall

      const peer = this.$WebRTC.getPeer(identifier)

      try {
        await peer?.call.createLocalTracks(kinds)
        await peer?.call.answer()
      } catch (error) {
        if (error instanceof Error) {
          this.$toast.error(this.$t(error.message) as string)
        }
      }

      const callingPath = `/chat/direct/${identifier}`
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
      const identifier = this.webrtc.incomingCall
      const peer = this.$WebRTC.getPeer(identifier)

      peer?.call.deny()

      this.$store.dispatch('webrtc/denyCall')
    },
    /**
     * @method hangUp
     * @description Hangs up active call
     * @example
     */
    hangUp() {
      if (!this.webrtc.activeCall) return
      const peer = this.$WebRTC.getPeer(this.webrtc.activeCall)
      peer?.call.hangUp()
      this.$store.dispatch('webrtc/hangUp')
      this.$store.commit('ui/fullscreen', false)
    },
    /**
     * @method share
     * @description copy link to clipboard
     * @param {Item} item
     */
    async share(item: Item) {
      this.$toast.show(this.$t('todo - share') as string)
      // if (item instanceof Directory) {
      //   this.$toast.show(this.$t('todo - share folders') as string)
      //   return
      // }
      // if (!item.shared) {
      //   this.$store.commit('ui/setIsLoadingFileIndex', true)
      //   item.shareItem()
      //   await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      //   this.$store.commit('ui/setIsLoadingFileIndex', false)
      //   this.$emit('forceRender')
      // }
      // navigator.clipboard.writeText(this.path).then(() => {
      //   this.$toast.show(this.$t('pages.files.link_copied') as string)
      // })
    },
    /**
     * @method closeFilePreview
     * @description Close File Preview
     * @example
     */
    closeFilePreview() {
      this.$store.commit('ui/setFilePreview', undefined)
    },
  },
})
</script>
