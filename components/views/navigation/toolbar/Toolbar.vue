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

import { mapState } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import { searchRecommend } from '~/mock/search'
import { SearchQueryItem } from '~/types/search/search'
import { ModalWindows } from '~/store/ui/types'
import { TrackKind } from '~/libraries/WebRTC/types'
import type { Friend, User } from '~/libraries/Iridium/friends/types'
import { RootState } from '~/types/store/store'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { useWebRTC } from '~/libraries/Iridium/webrtc/hooks'

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
      users: iridium.users.state,
      groups: iridium.groups.state,
      isGroupInviteVisible: false,
      webrtc: iridium.webRTC.state,
      webRTC: useWebRTC(),
    }
  },
  computed: {
    ...mapState({
      notifications: () => Object.entries(iridium.notifications?.state),
      ui: (state) => (state as RootState).ui,
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
      modals: (state) => (state as RootState).ui.modals,
    }),
    ModalWindows: () => ModalWindows,
    conversationId(): string {
      return this.$route.params.id
    },
    conversation(): Conversation {
      return iridium.chat.state.conversations[this.conversationId]
    },
    isGroup(): boolean {
      return this.conversation.participants.length > 2
    },
    details(): User | Conversation {
      if (this.isGroup) {
        return iridium.chat.state.conversations[this.conversationId]
      }
      const friendDid = this.conversation.participants.find(
        (f) => f !== iridium.connector?.id,
      ) as string
      return this.users[friendDid]
    },
    members(): User[] {
      return this.conversation.participants.map((did) => {
        return iridium.users.getUser(did)
      })
    },
    subtitleText(): string {
      if (!this.details) {
        return ''
      }
      if (this.isGroup) {
        return this.members.map((m) => m.name).join(', ')
      }
      return (this.details as User).status || 'offline'
    },
    enableRTC(): boolean {
      // todo- hook up to usermanager
      if (this.isGroup) {
        const memberIds = this.members.map((m) => m.did)
        return Object.values(this.users).some(
          (friend: Friend) =>
            memberIds.includes(friend.did) && friend.status === 'online',
        )
      }
      // Check current recipient is on the user's friends list
      const friend = Object.values(this.users).find(
        (f) => f.did === (this.details as User)?.did,
      )
      return friend?.status === 'online'
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
        state: { isOpen: true, group: this.details as Conversation },
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
    async call(kinds: TrackKind[]) {
      if (!this.enableRTC || !this.details) {
        return
      }
      try {
        await iridium.webRTC.call(this.details as User, kinds)
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
    },
    async handleCall() {
      if (this.isGroup) {
        return
      }
      if (!this.enableRTC || this.webRTC.isActiveCall) {
        return
      }
      await this.call(['audio'])
    },
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
