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
import { Group, GroupMember } from '~/store/groups/types'
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
    recipient: {
      type: Object as PropType<Group | Friend>,
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
      isGroup: (state) => (state as RootState).conversation.type === 'group',
      modals: (state) => (state as RootState).ui.modals,
    }),
    ...mapGetters('ui', ['showSidebar', 'allUnseenNotifications']),
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
        const group = this.groups.all.find(
          (group) => group.id === this.conversation.id,
        )
        const members = group?.members.map((m) => m.address)
        return this.friends.all.some(
          (friend: Friend) =>
            members?.includes(friend.address) && friend.state === 'online',
        )
      }
      // Check current recipient is on the user's friends list
      const friend = this.friends.all.find(
        (f) => f.address === this.recipient.address,
      )
      return friend?.state === 'online'
    },
    ModalWindows: () => ModalWindows,
    src(): string {
      const hash = (this.recipient as Friend).profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
    isGroup(): boolean {
      return 'members' in this.recipient
    },
    subtitleText(): string {
      if (this.isGroup) {
        const names = (this.recipient as Group).members.map(
          (member: GroupMember) => member.name,
        )
        return names.join(', ')
      }
      return (this.recipient as Friend).status
    },
    callTooltipText(): string {
      if (this.isGroup) {
        return this.$t('coming_soon.group_call') as string
      }
      return this.enableRTC
        ? (this.$t('controls.call') as string)
        : (this.$t('controls.not_connected') as string)
    },
  },
  methods: {
    groupInvite() {
      this.$store.commit('ui/toggleModal', {
        name: 'groupInvite',
        state: { isOpen: true, group: this.recipient },
      })
    },
    toggleAlerts() {
      this.$store.commit('ui/clearAllNotifications')
      this.showAlerts = !this.showAlerts
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
    toggleModal(modalName: ModalWindows) {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
    openProfile() {
      this.$store.dispatch('ui/showProfile', this.recipient)
    },
    async call(kinds: TrackKind[]) {
      if (!this.enableRTC) {
        return
      }
      try {
        await this.$store.dispatch('webrtc/call', {
          kinds,
        })
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
    },
    async handleCall() {
      if (this.isGroup) {
        return
      }
      if (!this.enableRTC || this.webrtc.activeCall) {
        return
      }
      await this.call(['audio'])
    },
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
