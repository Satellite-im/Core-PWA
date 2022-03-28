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
  UsersIcon,
  UserPlusIcon,
} from 'satellite-lucide-icons'

import { mapState, mapGetters } from 'vuex'
import { Group, Server } from '~/types/ui/core'
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
    UserPlusIcon,
    VideoIcon,
    ArchiveIcon,
    ShoppingBagIcon,
    CircleIcon,
    WalletIcon,
    BellIcon,
    UsersIcon,
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
      searchQuery: '' as string,
    }
  },
  computed: {
    ...mapState(['ui', 'audio', 'video', 'webrtc']),
    ...mapGetters('ui', ['showSidebar']),
    selectedGroup() {
      return this.$route.params.id // TODO: change with groupid - AP-400
    },
    recipient() {
      // It should not happen that someone tries to write to himself, but we should check
      // anyway
      const isMe =
        this.$route.params.address === this.$typedStore.state.accounts.active

      const groupId = this.$route.params.id

      const recipient = groupId
        ? { textilePubkey: groupId, type: 'group' }
        : isMe
        ? null
        : this.$typedStore.state.friends.all.find(
            (friend) => friend.address === this.$route.params.address,
          )
      return recipient
    },
    showSearchResult: {
      set(state) {
        this.$store.commit('ui/showSearchResult', state)
      },
      get() {
        return this.ui.showSearchResult
      },
    },
    enableRTC(): boolean {
      const activeFriend = this.$Hounddog.getActiveFriend(
        this.$store.state.friends,
      )
      if (activeFriend) {
        return this.webrtc.connectedPeers.includes(activeFriend.address)
      }
      return false
    },

    ModalWindows: () => ModalWindows,
    src(): string {
      // @ts-ignore curently reading user as type Server. Will likely be reworked with server update
      const hash = this.server?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  methods: {
    groupInvite(group: Group) {
      this.$store.commit('ui/toggleModal', {
        name: 'groupInvite',
        state: { isOpen: true, group },
      })
    },
    isGroup(thing: any) {
      return thing.type && thing.type === 'group'
    },
    getGroup() {
      return this.$store.state.groups.all.find(
        (g) => g.id === this.$route.params.id,
      )
    },
    /**
     * @method handleChange DocsTODO
     * @description
     * @param value
     * @param item
     * @example
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleChange(value: string, item: SearchQueryItem) {
      this.searchQuery = ''
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
      this.searchQuery = value
    },
    /**
     * @method toggleSearchResult DocsTODO
     * @description
     * @example
     */
    toggleSearchResult() {
      this.searchQuery = ''
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
      await this.$store.dispatch('webrtc/call', kinds)
    },
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
