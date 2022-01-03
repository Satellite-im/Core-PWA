<template src="./Toolbar.html" />

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

import { mapState } from 'vuex'
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
    handleChange(value: string, item: SearchQueryItem) {
    },
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
    async call(kinds: TrackKind[]) {
      if(!this.webrtc.connectedPeer) return
      const identifier = this.$Hounddog.getActiveFriend(
        this.$store.state.friends,
      ).address

      console.log('kind', kinds)

      // Trying to call the same user while call is already active
      if (identifier === this.$store.state.webrtc.activeCall) {
        return
      }

      const peer = this.$WebRTC.getPeer(identifier)

      const tracks = await peer?.call.createLocalTracks(kinds)

      await peer?.call.start()
    },
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
