<template>
  <default-layout>
    <swiper-slide class="sidebar-container">
      <Slimbar
        v-if="!$device.isMobile"
        :servers="$mock.servers"
        :unreads="friends.all"
        :open-modal="toggleModal"
      />
      <MobileSidebar
        v-if="$device.isMobile"
        :users="friends.all"
        :groups="$mock.groups"
        :sidebar="showSidebar"
        :show-menu="toggleMenu"
      />
      <Sidebar
        v-if="!$device.isMobile"
        :users="friends.all"
        :groups="groups.all"
        :sidebar="showSidebar"
        :show-menu="toggleMenu"
      />
    </swiper-slide>
    <!-- Hide swiper slide when no friends and mobile -->
    <swiper-slide
      v-if="!(isNoFriends && $device.isMobile)"
      :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`"
    >
      <DroppableWrapper @handle-drop-prop="handleDrop">
        <menu-icon
          v-if="!showSidebar || $device.isMobile"
          class="toggle--sidebar"
          data-cy="toggle-sidebar"
          size="1.2x"
          full-width
          @click="toggleMenu"
        />
        <Toolbar
          v-if="recipient"
          id="toolbar"
          :server="recipient"
          :user="recipient"
        />
        <Media
          v-if="$device.isMobile"
          :fullscreen="ui.fullscreen"
          :users="$mock.callUsers"
          :max-viewable-users="10"
          :fullscreen-max-viewable-users="6"
        />
        <Media
          v-else
          :fullscreen="ui.fullscreen"
          :users="$mock.callUsers"
          :max-viewable-users="10"
          :fullscreen-max-viewable-users="20"
        />
        <UiChatScroll
          ref="chatScroll"
          :prevent-scroll-offset="10"
          :older-messages-scroll-offset="300"
          :class="
            $store.state.friends.all.find(
              (friend) => friend.address === $store.state.webrtc.activeCall,
            )
              ? 'media-open'
              : 'media-unopen'
          "
          enable-wrap
          :user="recipient"
        >
          <Nuxt />
        </UiChatScroll>
        <WalletMini v-if="ui.modals.walletMini" />
        <UiChatInfo
          v-if="showOlderMessageInfo"
          :caption="$t('pages.chat.older_messages')"
          type="primary"
          @click="handleClick()"
        >
          <chevron-down-icon size="1.5x" />
          {{ $t('pages.chat.recent_messages') }}
        </UiChatInfo>
        <Chatbar v-if="recipient" ref="chatbar" :recipient="recipient" />
      </DroppableWrapper>
    </swiper-slide>
    <swiper-slide v-if="$data.asidebar" class="aside-container">
      <GroupAside
        :toggle="() => ($data.asidebar = !$data.asidebar)"
        :selected-group="
          $mock.groups.find((group) => group.address === selectedGroup)
        "
        :friends="$mock.friends"
      />
    </swiper-slide>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { MenuIcon, ChevronDownIcon } from 'satellite-lucide-icons'
import DroppableWrapper from '../components/ui/DroppableWrapper/DroppableWrapper.vue'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import { DataStateType } from '~/store/dataState/types'
import { SettingsRoutes } from '~/store/ui/types'
import DefaultLayout from '~/layouts/default.vue'

declare module 'vue/types/vue' {
  interface Vue {
    showSidebar: boolean
  }
}

export default Vue.extend({
  name: 'ChatLayout',
  components: {
    MenuIcon,
    ChevronDownIcon,
    DroppableWrapper,
    DefaultLayout,
  },
  mixins: [Touch, Layout],
  layout: 'default',
  middleware: ['authenticated'],
  computed: {
    ...mapState([
      'audio',
      'ui',
      'media',
      'friends',
      'groups',
      'dataState',
      'settings',
    ]),
    ...mapGetters('ui', ['showSidebar']),
    DataStateType: () => DataStateType,
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
        ? { textilePubkey: groupId }
        : isMe
        ? null
        : this.$typedStore.state.friends.all.find(
            (friend) => friend.address === this.$route.params.address,
          )
      return recipient
    },
    showOlderMessageInfo() {
      return this.ui.showOlderMessagesInfo
    },
    isNoFriends() {
      return (
        this.dataState.friends !== this.DataStateType.Loading &&
        !this.friends.all.length
      )
    },
  },
  mounted() {
    this.$Sounds.changeLevels(this.audio.volume / 100)

    const appHeight = () => {
      const doc = document.documentElement
    }
    window.addEventListener('resize', appHeight)
    appHeight()
    if (this.$device.isMobile) {
      this.$store.commit('ui/toggleSettings', { show: false })
    }
  },
  methods: {
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.showSidebar)
    },
    /**
     * @method handleDrop
     * @description Allows the drag and drop of files into the chatbar
     * @param e Drop event data object
     * @example v-on:drop="handleDrop"
     */
    handleDrop(e: DragEvent) {
      e.preventDefault()

      if (!this.settings.consentScan) {
        this.$toast.error(
          this.$t('pages.files.errors.enable_consent') as string,
          {
            duration: 3000,
          },
        )
        this.$store.commit('ui/toggleSettings', {
          show: true,
          defaultRoute: SettingsRoutes.PRIVACY,
        })
        return
      }
      if (e?.dataTransfer) {
        this.$refs.chatbar?.handleUpload(e.dataTransfer?.items, e)
      }
    },
    handleClick() {
      this.$refs.chatScroll?.autoScrollToBottom()
    },
  },
})
</script>
