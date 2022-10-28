<template src="./Toolbar.html"></template>

<script lang="ts">
import Vue, { computed, ComputedRef } from 'vue'
import {
  PhoneCallIcon,
  ArchiveIcon,
  ShoppingBagIcon,
  BellIcon,
  WalletIcon,
  UserPlusIcon,
} from 'satellite-lucide-icons'

import { mapState } from 'vuex'
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import iridium from '~/libraries/Iridium/IridiumManager'
import { searchRecommend } from '~/mock/search'
import { SearchQueryItem } from '~/types/search/search'
import { ModalWindows } from '~/store/ui/types'
import { RootState } from '~/types/store/store'
import { conversationHooks } from '~/components/compositions/conversations'
import { webrtcHooks } from '~/components/compositions/webrtc'
import { User } from '~/libraries/Iridium/users/types'
import { TrackKind } from '~/libraries/WebRTC/types'

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
    const $nuxt = useNuxtApp()
    const conversationId: ComputedRef<string | undefined> = computed(() => {
      return $nuxt.$route.params.id
    })

    const { conversation, isGroup, otherDids, otherParticipants } =
      conversationHooks(conversationId.value)
    const { enableRTC, call } = webrtcHooks(conversationId.value)

    const subtitleText: ComputedRef<string | undefined> = computed(() => {
      if (isGroup.value) {
        return
      }
      // todo - replace with user status message set in profile settings
      return iridium.users.ephemeral.status[otherDids.value[0]] || 'offline'
    })

    const callTooltipText: ComputedRef<string> = computed(() => {
      if (isGroup.value) {
        return $nuxt.$i18n.t('coming_soon.group_call')
      }
      return $nuxt.$i18n.t(
        enableRTC.value ? 'controls.call' : 'controls.not_connected',
      )
    })

    return {
      conversation,
      conversationId,
      isGroup,
      enableRTC,
      subtitleText,
      callTooltipText,
      otherParticipants,
      otherDids,
      call,
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
      showSidebar: (state) => (state as RootState).ui.showSidebar,
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
    }),
    ModalWindows: () => ModalWindows,
  },
  methods: {
    async handleCall() {
      if (this.isGroup || !this.enableRTC) {
        return
      }
      const kinds = [] as TrackKind[]
      if (!this.audio.muted) {
        kinds.push('audio')
      }
      this.$store.commit('video/setDisabled', true)
      await this.call({
        recipient: this.otherDids[0],
        conversationId: this.conversationId,
        kinds,
      })
    },
    toggleAlerts() {
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
