<template src="./Toolbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  PhoneCallIcon,
  VideoIcon,
  ArchiveIcon,
  ShoppingBagIcon,
  CircleIcon,
  BellIcon,
  WalletIcon,
} from 'satellite-lucide-icons'

import { mapState, mapGetters } from 'vuex'
import { Server } from '~/types/ui/core'
import { User } from '~/types/ui/user'
import { searchRecommend } from '~/mock/search'
import { SearchQueryItem } from '~/types/search/search'
import { ModalWindows } from '~/store/ui/types'
import { TrackKind } from '~/libraries/WebRTC/types'

declare module 'vue/types/vue' {
  interface Vue {
    search: any
    ui: any
  }
}
export default Vue.extend({
  components: {
    PhoneCallIcon,
    VideoIcon,
    ArchiveIcon,
    ShoppingBagIcon,
    CircleIcon,
    WalletIcon,
    BellIcon,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    server: {
      type: Object as PropType<Server>,
      default: () => {},
    },
    user: {
      type: Object as PropType<User>,
      default: () => ({
        name: '',
        address: '',
        status: '',
      }),
      required: true,
    },
  },
  data() {
    return {
      searchRecommend,
      showAlerts: false,
    }
  },
  computed: {
    ...mapState(['ui', 'search', 'audio', 'video', 'webrtc']),
    ...mapGetters('ui', ['showSidebar']),
    showSearchResult: {
      set(state) {
        this.$store.commit('ui/showSearchResult', state)
      },
      get() {
        return this.ui.showSearchResult
      },
    },
    searchQuery: {
      set(state) {
        this.$store.commit('search/setSearchQuery', state)
      },
      get() {
        return this.search.query
      },
    },
    ModalWindows: () => ModalWindows,
    src(): string {
      // @ts-ignore curently reading user as type Server. Will likely be reworked with server update
      const hash = this.server?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  methods: {
    /**
     * @method handleChange DocsTODO
     * @description
     * @param value
     * @param item
     * @example
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleChange(value: string, item: SearchQueryItem) {},
    /**
     * @method handleSearch DocsTODO
     * @description
     * @param value
     * @param item
     * @example
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSearch(value: string, items: SearchQueryItem[]) {
      this.showSearchResult = true
      this.searchQuery = value
    },
    /**
     * @method toggleSearchResult DocsTODO
     * @description
     * @example
     */
    toggleSearchResult() {
      this.showSearchResult = !this.showSearchResult
    },
    /**
     * @method toggleModal
     * @param modalName - enum for which modal
     * @description This updates the state to show/hide the specific modal you pass in
     * @example toggleModal(ModalWindows.WALLET)
     */
    toggleModal(modalName: keyof ModalWindows): void {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
    openProfile() {
      this.$store.dispatch('ui/showProfile', this.user)
    },
    async call(kinds: TrackKind[]) {
      if (!this.webrtc.connectedPeers) return
      const activeFriend = this.$Hounddog.getActiveFriend(
        this.$store.state.friends,
      )
      if (!activeFriend) return
      const identifier = activeFriend.address

      if (!this.webrtc.connectedPeers.includes(identifier)) {
        await this.$store.dispatch('webrtc/createPeerConnection', identifier)
        if (!this.webrtc.connectedPeer) return
      }

      // Trying to call the same user while call is already active
      if (identifier === this.$store.state.webrtc.activeCall) {
        return
      }

      const peer = this.$WebRTC.getPeer(identifier)

      try {
        await peer?.call.createLocalTracks(kinds)
        await peer?.call.start()
      } catch (error) {
        if (error instanceof Error) {
          this.$toast.error(this.$t(error.message) as string)
        }
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
