<template>
  <div
    id="app-wrap"
    :class="`${$store.state.ui.theme.base.class}
    ${showSidebar ? 'is-open' : 'is-collapsed chat-page'} ${
      asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside'
    } ${selectedGroup ? 'active-group' : null}`"
  >
    <div
      id="app"
      :class="`${showSidebar ? 'is-open' : 'is-collapsed'} ${
        asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside'
      } ${selectedGroup ? 'group' : 'direct'} ${
        $device.isMobile ? 'mobile-app' : 'desktop'
      }`"
    >
      <UiGlobal />
      <swiper
        ref="swiper"
        class="swiper"
        :options="{ ...swiperOption, initialSlide: swiperSlideIndex }"
      >
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
                $store.state.webrtc.activeCall &&
                $store.state.webrtc.activeCall.callId
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
      </swiper>
    </div>
    <MobileNav v-if="$device.isMobile" />
    <!-- Sets the global css variable for the theme flair color -->
    <v-style>
      :root { --flair-color: {{ flairColor[0] }}; --flair-color-secondary:
      {{ flairColor[1] }};}
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { MenuIcon, ChevronDownIcon } from 'satellite-lucide-icons'
import DroppableWrapper from '../components/ui/DroppableWrapper/DroppableWrapper.vue'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import useMeta from '~/components/compositions/useMeta'
import { DataStateType } from '~/store/dataState/types'
import { SettingsRoutes } from '~/store/ui/types'
import type { Friend } from '~/types/ui/friends'
import type { Group } from '~/types/messaging'

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
    ...mapState([
      'audio',
      'ui',
      'media',
      'friends',
      'groups',
      'dataState',
      'settings',
      'conversation',
    ]),
    ...mapGetters('ui', ['showSidebar', 'swiperSlideIndex']),
    DataStateType: () => DataStateType,
    selectedGroup() {
      return this.$route.params.id // TODO: change with groupid - AP-400
    },
    recipient() {
      const recipient =
        this.conversation.type === 'group'
          ? this.groups.all.find(
              (group: Group) => group.id === this.conversation.id,
            )
          : this.friends.all.find(
              (friend: Friend) => friend.peerId === this.conversation.id,
            )
      return recipient
    },
    flairColor() {
      return this.ui.theme.flair.value
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
  watch: {
    recipient: {
      handler() {},
      immediate: true,
    },
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
  },
  beforeDestroy() {
    // reset active conversation on chat leave
    this.$store.commit('textile/setActiveConversation', '')
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

<style lang="less" src="./Layout.less"></style>
