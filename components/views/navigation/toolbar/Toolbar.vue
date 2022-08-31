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
import { TrackKind } from '~/libraries/WebRTC/types'
import { RootState } from '~/types/store/store'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { conversationHooks } from '~/components/compositions/conversations'

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
    const { conversation, isGroup, otherDids, enableRTC } = conversationHooks()

    const subtitleText = computed(() => {
      if (isGroup.value) {
        return (
          conversation?.value?.participants
            ?.map((did) => iridium.users.state[did]?.name)
            .join(', ') ?? ''
        )
      }
      // todo - replace with user status message set in profile settings
      return iridium.users.userStatus[otherDids.value[0]] || 'offline'
    })

    const callTooltipText = computed(() => {
      if (isGroup.value) {
        return $nuxt.$i18n.t('coming_soon.group_call')
      }
      return $nuxt.$i18n.t(
        enableRTC.value ? 'controls.call' : 'controls.not_connected',
      )
    })

    return {
      conversation,
      isGroup,
      otherDids,
      enableRTC,
      subtitleText,
      callTooltipText,
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
    conversationId(): Conversation['id'] | undefined {
      return this.$route.params.id
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
      if (!this.enableRTC || !this.conversationId) {
        return
      }
      try {
        await iridium.webRTC.call({
          recipient: this.otherDids[0],
          conversationId: this.conversationId,
          kinds,
        })
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
    },
    async handleCall() {
      if (this.isGroup || !this.enableRTC) {
        return
      }
      await this.call(['audio'])
    },
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
