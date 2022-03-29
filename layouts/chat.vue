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
      <swiper ref="swiper" class="swiper" :options="swiperOption">
        <swiper-slide class="sidebar-container">
          <Slimbar
            v-if="!$device.isMobile"
            :servers="$mock.servers"
            :unreads="friends.all"
            :open-modal="toggleModal"
          />
          <Sidebar
            :users="friends.all"
            :groups="groups.all"
            :sidebar="showSidebar"
            :show-menu="toggleMenu"
          />
        </swiper-slide>
        <swiper-slide
          :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`"
        >
          <DroppableWrapper @handle-drop-prop="handleDrop">
            <menu-icon
              class="toggle--sidebar"
              size="1.2x"
              full-width
              :style="`${!showSidebar ? 'display: block' : 'display: none'}`"
              @click="toggleMenu"
            />
            <Toolbar
              v-if="recipient"
              id="toolbar"
              :server="null"
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
              :prevent-scroll-offset="500"
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
      :root { --flair-color: {{ $store.state.ui.theme.flair.value }}; }
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import DroppableWrapper from '../components/ui/DroppableWrapper/DroppableWrapper.vue'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import { MessagingTypesEnum } from '~/libraries/Enums/types/messaging-types'

export default Vue.extend({
  name: 'ChatLayout',
  components: {
    MenuIcon,
    DroppableWrapper,
  },
  mixins: [Touch, Layout],
  middleware: ['authenticated'],
  data() {
    return {
      sidebar: !this.$device.isMobile,
      asidebar: !this.$device.isMobile,
      swiperOption: {
        initialSlide: this.$device.isMobile ? 1 : 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: !this.$device.isMobile,
        allowTouchMove: !!this.$device.isMobile,
        on: {
          slideChange: () => {
            if (this.$refs.swiper && this.$refs.swiper.$swiper) {
              const newShowSidebar = this.$refs.swiper.$swiper.activeIndex === 0

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
    ...mapState(['audio', 'ui', 'media', 'friends', 'groups']),
    ...mapGetters('ui', ['showSidebar']),
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
        ? this.$typedStore.state.groups.all.find(
            (group) => group.id === groupId,
          )
        : isMe
        ? null
        : this.$typedStore.state.friends.all.find(
            (friend) => friend.address === this.$route.params.address,
          )
      return recipient
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
    $route() {
      this.showInitialSidebar()
    },
  },
  mounted() {
    this.$Sounds.changeLevels(this.audio.volume / 100)

    const appHeight = () => {
      const doc = document.documentElement
    }
    window.addEventListener('resize', appHeight)
    appHeight()
    this.showInitialSidebar()
    if (this.$device.isMobile) {
      this.$store.commit('ui/toggleSettings', { show: false })
    }
  },
  methods: {
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.showSidebar)
    },
    showInitialSidebar() {
      if (this.$device.isMobile && this.$route.params.address) {
        return this.$store.commit('ui/showSidebar', false)
      }
      this.$store.commit('ui/showSidebar', true)
    },
    /**
     * @method handleDrop
     * @description Allows the drag and drop of files into the chatbar
     * @param e Drop event data object
     * @example v-on:drop="handleDrop"
     */
    handleDrop(e: DragEvent) {
      if (e?.dataTransfer) {
        this.$refs.chatbar?.handleUpload(e.dataTransfer?.items, e)
      }
    },
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
