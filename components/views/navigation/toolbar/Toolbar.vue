<template src="./Toolbar.html"></template>

<script lang="ts">
import Vue from 'vue'

import {
  PhoneCallIcon,
  ArchiveIcon,
  ShoppingBagIcon,
  BellIcon,
  WalletIcon,
  UserPlusIcon,
} from 'satellite-lucide-icons'

import { mapState, mapGetters } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import Group from '~/libraries/Iridium/groups/Group'
import { searchRecommend } from '~/mock/search'
import { SearchQueryItem } from '~/types/search/search'
import { ModalWindows } from '~/store/ui/types'
import { TrackKind } from '~/libraries/WebRTC/types'
import type { Friend, User } from '~/libraries/Iridium/friends/types'
import { RootState } from '~/types/store/store'
import { GroupMemberDetails } from '~/libraries/Iridium/groups/types'

export default Vue.extend({
  components: {
    PhoneCallIcon,
    UserPlusIcon,
    ArchiveIcon,
    ShoppingBagIcon,
    WalletIcon,
    BellIcon,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchRecommend,
      showAlerts: false,
      searchQuery: '' as string,
      conversation: iridium.chat.state.conversations[this.$route.params.id],
      friends: iridium.friends.state.list,
      groups: iridium.groups.state,
      isGroupInviteVisible: false,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
      webrtc: (state) => (state as RootState).webrtc,
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
      if (this.isGroup) {
        const memberIds = (this.groupMembers as GroupMemberDetails[]).map(
          (member) => member.id,
        )
        return this.friends.some(
          (friend: Friend) =>
            memberIds.includes(friend.did) && friend.status === 'online',
        )
      }
      // Check current recipient is on the user's friends list
      const friend = this.friends.find(
        (f) => f.did === (this.details as User)?.did,
      )
      return friend?.status === 'online'
    },
    ModalWindows: () => ModalWindows,
    isGroup(): boolean {
      return this.conversation.type === 'group'
    },

    groupMembers(): GroupMemberDetails[] {
      if (!this.isGroup) return []
      const groupMembers = (this.details as Group).members
      return Object.values(groupMembers ?? {})
    },
    subtitleText(): string {
      if (!this.details) {
        return ''
      }
      if (this.isGroup) {
        const names = (this.groupMembers as GroupMemberDetails[])
          .map((m) => m.name)
          .join(', ')
        return names ?? ''
      }
      return (this.details as User).status || 'offline'
    },
    callTooltipText(): string {
      if (this.isGroup) {
        return this.$t('coming_soon.group_call') as string
      }
      return this.enableRTC
        ? (this.$t('controls.call') as string)
        : (this.$t('controls.not_connected') as string)
    },
    details(): User | Group | undefined {
      if (this.isGroup) {
        return this.groups[this.conversation.id]
      }
      const friendDid = this.conversation.participants.find(
        (f) => f !== iridium.connector?.id,
      )
      return this.friends.find((f) => f.did === friendDid)
    },
  },
  methods: {
    groupInvite() {
      this.$store.commit('ui/toggleModal', {
        name: 'groupInvite',
        state: { isOpen: true, group: this.details as Group },
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
    toggleModal() {
      this.isGroupInviteVisible = !this.isGroupInviteVisible
    },
    // hide profile modal depend on this task AP-1717 (https://satellite-im.atlassian.net/browse/AP-1717)
    // openProfile() {
    //   this.$store.dispatch('ui/showProfile', this.recipient)
    // },
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
