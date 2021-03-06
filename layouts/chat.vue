<template>
  <div
    id="app-wrap"
    :class="[
      `theme-${settings.theme}`,
      showSidebar ? 'is-open' : 'is-collapsed chat-page',
      asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside',
      selectedGroup ? 'active-group' : null,
    ]"
  >
    <div
      id="app"
      :class="[
        showSidebar ? 'is-open' : 'is-collapsed',
        asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside',
        selectedGroup ? 'group' : 'direct',
        $device.isMobile ? 'mobile-app' : 'desktop',
        isBackgroundCall ? 'has-background-call' : '',
      ]"
    >
      <swiper
        ref="swiper"
        class="swiper"
        :options="{ ...swiperOption, initialSlide: swiperSlideIndex }"
      >
        <swiper-slide class="sidebar-container">
          <Slimbar
            v-if="!$device.isMobile"
            :servers="$mock.servers"
            :open-modal="toggleModal"
          />
          <MobileSidebar
            v-if="$device.isMobile"
            :users="friends.all"
            :groups="$mock.groups"
            :sidebar="showSidebar"
            :show-menu="toggleMenu"
          />
          <Sidebar v-if="!$device.isMobile" :sidebar="showSidebar" />
        </swiper-slide>
        <!-- Hide swiper slide when no friends and mobile -->
        <swiper-slide
          v-if="!(isNoFriends && $device.isMobile)"
          data-cy="swiper-slide"
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
            <Toolbar id="toolbar" />
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
            <!--            <UiChatScroll
              ref="chatScroll"
              :prevent-scroll-offset="10"
              :older-messages-scroll-offset="300"
              :class="{ 'media-open': isActiveCall }"
              enable-wrap
              :user="recipient"
            >
              <Nuxt />
            </UiChatScroll>-->
            <Nuxt />
            <WalletMini v-if="ui.modals.walletMini" />
            <Chatbar ref="chatbar" />
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
      </swiper>
      <UiGlobal />
    </div>
    <MobileNav v-if="$device.isMobile" />
    <!-- Sets the global css variable for the theme flair color -->
    <v-style>
      :root { --flair-color: {{ flair.primary }}; --flair-color-secondary:
      {{ flair.secondary }}; --flair-color-rgb: {{ flair.primaryRGB }}; }
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import DroppableWrapper from '../components/ui/DroppableWrapper/DroppableWrapper.vue'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import useMeta from '~/components/compositions/useMeta'
import { DataStateType } from '~/store/dataState/types'
import { SettingsRoutes } from '~/store/ui/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs, Flair, Settings } from '~/libraries/Iridium/settings/types'
import { ChatbarRef } from '~/components/views/chat/chatbar/Chatbar.vue'

declare module 'vue/types/vue' {
  interface Vue {
    showSidebar: boolean
  }
}

export default Vue.extend({
  name: 'ChatLayout',
  components: {
    MenuIcon,
    DroppableWrapper,
  },
  mixins: [Touch, Layout],
  middleware: ['authenticated'],
  setup() {
    useMeta()
  },
  data() {
    return {
      sidebar: !this.$device.isMobile,
      asidebar: !this.$device.isMobile,
      settings: iridium.settings.state,
      swiperOption: {
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: !this.$device.isMobile,
        allowTouchMove: !!this.$device.isMobile,
        on: {
          slideChange: () => {
            if (this.$refs.swiper && this.$refs.swiper.$swiper) {
              const activeIndex = this.$refs.swiper.$swiper.activeIndex
              this.$store.commit('ui/setSwiperSlideIndex', activeIndex)

              const newShowSidebar = activeIndex === 0

              // force virtual keyboard hide on mobile when swiper slide change
              if (newShowSidebar) {
                document.activeElement.blur()
              }

              if (this.showSidebar !== newShowSidebar) {
                this.$store.commit('ui/showSidebar', newShowSidebar)
              }
              this.$data.asidebar = this.$refs.swiper.$swiper.activeIndex === 2
            }
          },
        },
      },
    }
  },
  computed: {
    ...mapState({
      audio: (state) => (state as RootState).audio,
      ui: (state) => (state as RootState).ui,
      media: (state) => (state as RootState).media,
      friends: (state) => (state as RootState).friends,
      groups: (state) => (state as RootState).groups,
      dataState: (state) => (state as RootState).dataState,
      conversation: (state) => (state as RootState).conversation,
      webrtc: (state) => (state as RootState).webrtc,
    }),
    ...mapGetters('ui', ['showSidebar', 'swiperSlideIndex']),
    ...mapGetters('conversation', ['recipient']),
    ...mapGetters('webrtc', ['isBackgroundCall', 'isActiveCall']),
    DataStateType: () => DataStateType,
    selectedGroup(): string {
      return this.$route.params.id // TODO: change with groupid - AP-400
    },
    recipient(): Friend | Group {
      const recipient = iridium.friends?.getFriend(this.conversation.id)
      if (!recipient) {
        return {}
      }
      return recipient

      // const recipient = iridium.friends?.state.details.find(
      //   (friend: Friend) => friend.did === this.conversation.id,
      // )
      // console.log('debug: | recipient | recipient', recipient)

      // const recipient =
      //   this.conversation.type === 'group'
      //     ? this.groups.all.find(
      //         (group: Group) => group.id === this.conversation.id,
      //       )
      //     : this.friends.all.find(
      //         (friend: Friend) => friend.peerId === this.conversation.id,
      //       )
      // return recipient
    },
    consentToScan(): boolean {
      return iridium.settings.state.privacy.consentToScan
    },
    flair(): Flair {
      return flairs[((this as any).settings as Settings).flair]
    },
    showOlderMessageInfo(): boolean {
      return this.ui.showOlderMessagesInfo
    },
    isNoFriends(): boolean {
      return (
        this.dataState.friends !== this.DataStateType.Loading &&
        !this.friends.all.length
      )
    },
  },
  watch: {
    showSidebar(newValue, oldValue) {
      if (newValue !== oldValue) {
        newValue
          ? this.$refs.swiper.$swiper.slidePrev()
          : this.$refs.swiper.$swiper.slideNext()
      }
    },
    swiperSlideIndex(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$refs.swiper.$swiper.slideTo(newValue)
      }
    },
    $route() {
      this.$store.commit('ui/setShowOlderMessagesInfo', false)
    },
  },
  beforeDestroy() {
    this.$store.commit('ui/setShowOlderMessagesInfo', false)
    // reset active conversation on chat leave
    this.$store.commit('textile/setActiveConversation', '')
    this.$store.commit('conversation/resetConversation')
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
      if (!this.consentToScan) {
        this.$store.dispatch('ui/displayConsentSettings')
        return
      }
      if (e?.dataTransfer && this.$refs.chatbar) {
        ;(this.$refs.chatbar as ChatbarRef).handleUpload([
          ...e.dataTransfer.items,
        ])
      }
    },
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
