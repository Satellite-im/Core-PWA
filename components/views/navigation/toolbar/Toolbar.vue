<template src="./Toolbar.html"></template>

<script lang="ts">
import Vue, { computed } from 'vue'
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
import { RootState } from '~/types/store/store'
import {
  conversationHooks,
  call,
} from '~/components/compositions/conversations'

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
  setup() {
    // @ts-ignore
    const $nuxt = useNuxtApp()
    const { conversation, conversationId, isGroup, otherDids, enableRTC } =
      conversationHooks()

    const subtitleText = computed(() => {
      if (isGroup.value) {
        return (
          conversation?.value?.participants
            ?.map((did) => iridium.users.state[did]?.name)
            .join(', ') ?? ''
        )
      }
      // todo - replace with user status message set in profile settings
      return iridium.users.ephemeral.status[otherDids.value[0]] || 'offline'
    })

    const callTooltipText = computed(() => {
      if (isGroup.value) {
        return $nuxt.$i18n.t('coming_soon.group_call')
      }
      return $nuxt.$i18n.t(
        enableRTC.value ? 'controls.call' : 'controls.not_connected',
      )
    })

    async function handleCall() {
      if (isGroup.value || !enableRTC.value) {
        return
      }
      await call({
        recipient: otherDids.value[0],
        conversationId: conversationId.value,
        kinds: ['audio'],
      })
    }

    return {
      conversation,
      isGroup,
      otherDids,
      enableRTC,
      subtitleText,
      callTooltipText,
      handleCall,
    }
  },
  data() {
    return {
      searchRecommend,
      notifications: iridium.notifications.state,
      chat: iridium.chat.state,
      showAlerts: false,
      searchQuery: '' as string,
      isGroupInviteVisible: false,
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    ModalWindows: () => ModalWindows,
<<<<<<< HEAD
=======
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
        (f: string) => f !== iridium.id,
      ) as string
      return this.users[friendDid] as User
    },
    status(): UserStatus {
      return this.isGroup
        ? 'offline'
        : (this.details && this.userStatus[(this.details as User).did]) ||
            'offline'
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
      if (!this.userStatus[(this.details as User).did]) {
        iridium.users.setUserStatus((this.details as User).did, 'offline')
      }
      return this.userStatus[(this.details as User).did]
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
>>>>>>> 65ada70dc (feat(chat): misc. cleanup, middleware improvements, webrtc mute changes)
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
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
