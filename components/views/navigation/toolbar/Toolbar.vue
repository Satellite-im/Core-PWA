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
    ...mapState(['ui', 'search']),
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
      // console.log('change-search-input:', value, item)
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
    async call(hasVideo: boolean) {
      const identifier = this.$store.state.friends.all.find((f: any) => f.activeChat ).address
      // Trying to call the same user while call is already active
      if (identifier === this.$store.state.webrtc.activeCall) {
        return
      }
      // Trying to call different user while call is already active
      if (this.$store.state.webrtc.activeCall.length > 0) {
        const oldPeer = this.$WebRTC.getPeer(this.$store.state.webrtc.activeCall)
        oldPeer?.call.hangUp()
      }

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
      peer?.call.start(stream)
      if (!hasVideo) {
        peer?.call.addTransceiver('video')
      }

      this.$store.dispatch('webrtc/makeCall', { id: identifier, stream: stream })
    }
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
