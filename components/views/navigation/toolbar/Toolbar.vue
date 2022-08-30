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
import { RootState } from '~/types/store/store'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { User } from '~/libraries/Iridium/users/types'

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
      notifications: iridium.notifications.state,
      chat: iridium.chat.state,
      showAlerts: false,
      searchQuery: '' as string,
      users: iridium.users.state,
      userStatus: iridium.users.userStatus,
      groups: iridium.groups.state,
      isGroupInviteVisible: false,
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    ModalWindows: () => ModalWindows,
    conversationId(): Conversation['id'] | undefined {
      return this.$route.params.id
    },
    isActiveCall(): boolean {
      return this.webrtc.activeCall?.callId === this.conversationId
    },
    conversation(): Conversation | undefined {
      return (
        (this.conversationId && this.chat.conversations[this.conversationId]) ||
        undefined
      )
    },
    isGroup(): boolean {
      return (this.conversation?.participants || []).length > 2
    },
    details(): User | Conversation {
      if (this.isGroup && this.conversationId) {
        return this.chat.conversations[this.conversationId]
      }
      const friendDid = this.conversation?.participants.find(
        (f: string) => f !== iridium.connector?.id,
      ) as string
      return this.users[friendDid] as User
    },
    members(): (User | undefined)[] {
      if (!this.conversation) {
        return []
      }
      return (this.conversation?.participants || []).map((did) => {
        return iridium.users.getUser(did)
      }) as User[]
    },
    subtitleText(): string {
      if (!this.details) {
        return ''
      }
      if (this.isGroup) {
        return this.members.map((m) => m?.name).join(', ')
      }
      return this.userStatus[(this.details as User).did] || 'offline'
    },
    enableRTC(): boolean {
      if (this.isGroup) {
        const memberIds = this.members.map((m) => m?.did)
        return Object.values(this.users).some(
          (friend: User) =>
            memberIds.includes(friend.did) &&
            this.userStatus[friend.did] === 'online',
        )
      }
      const did = (this.details as User).did
      // Check current recipient is on the user's friends list
      return this.userStatus[did] === 'online'
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
        await iridium.webRTC.call(this.details as any, kinds)
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
    },
    async handleCall() {
      if (this.isGroup) {
        return
      }
      if (!this.enableRTC || this.isActiveCall) {
        return
      }
      await this.call(['audio'])
    },
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
