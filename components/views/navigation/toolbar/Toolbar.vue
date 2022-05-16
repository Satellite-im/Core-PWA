<template src="./Toolbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  PhoneCallIcon,
  ScreenShareIcon,
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
import { Friend } from '~/types/ui/friends'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    PhoneCallIcon,
    UserPlusIcon,
    ScreenShareIcon,
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
    ...mapState({
      ui: (state) => (state as RootState).ui,
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
      webrtc: (state) => (state as RootState).webrtc,
      conversation: (state) => (state as RootState).conversation,
      groups: (state) => (state as RootState).groups,
      friends: (state) => (state as RootState).friends,
    }),
    ...mapGetters('ui', ['showSidebar', 'allUnseenNotifications']),
    selectedGroup(): string {
      return this.$route.params.id // TODO: change with groupid - AP-400
    },
    recipient():
      | Friend
      | { textilePubkey: string; type: string }
      | null
      | undefined {
      // It should not happen that someone tries to write to himself, but we should check
      // anyway
      const isMe =
        this.$route.params.address === this.$typedStore.state.accounts.active

      if (isMe) {
        return null
      }

      return this.conversation.type === 'group' ? this.group : this.friend
    },
    group() {
      return this.$store.state.groups.all.find(
        (g) => g.id === this.$route.params.id,
      )
    },
    friend() {
      return this.$store.state.friends.all.find(
        (f) => f.address === this.$route.params.address,
      )
    },
    showSearchResult: {
      set(state): void {
        this.$store.commit('ui/showSearchResult', state)
      },
      get(): boolean {
        return this.ui.showSearchResult
      },
    },
    enableRTC(): boolean {
      if (this.conversation.type === 'group') {
        const group = this.$typedStore.state.groups.all.find(
          (group) => group.id === this.conversation.id,
        )
        const members = group?.members.map((m) => m.address)
        return this.$typedStore.state.friends.all.some(
          (friend: Friend) =>
            members?.includes(friend.address) && friend.state === 'online',
        )
      }
      return this.$typedStore.state.friends.all.some(
        (friend) => friend.state === 'online',
      )
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
    toggleAlerts() {
      this.showAlerts = !this.showAlerts
    },
    isGroup(thing: any) {
      return thing?.type && thing?.type === 'group'
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
    toggleModal(modalName: keyof ModalWindows) {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
    openProfile() {
      this.$store.dispatch('ui/showProfile', this.user)
    },
    async call(kinds: TrackKind[]) {
      if (!this.enableRTC) {
        return
      }
      await this.$store.dispatch('webrtc/call', {
        kinds,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
