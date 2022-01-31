<template>
  <div
    id="app-wrap"
    :class="`${$store.state.ui.theme.base.class}
    ${showSidebar ? 'is-open' : 'is-collapsed'} ${
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
            :unreads="$mock.unreads"
            :open-modal="toggleModal"
          />
          <Sidebar
            :users="friends.all"
            :groups="$mock.groups"
            :sidebar="showSidebar"
            :show-menu="toggleMenu"
          />
        </swiper-slide>
        <swiper-slide
          :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`"
        >
          <menu-icon
            class="toggle--sidebar"
            size="1.2x"
            full-width
            :style="`${!showSidebar ? 'display: block' : 'display: none'}`"
            @click="toggleMenu"
          />
          <Toolbar
            id="toolbar"
            :server="recipient || $mock.users[0]"
            :user="$mock.users[0]"
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
            :contents="ui.messages"
            :prevent-scroll-offset="500"
            :class="
              $store.state.friends.all.find(
                (friend) => friend.address === $store.state.webrtc.activeCall,
              )
                ? 'media-open'
                : 'media-unopen'
            "
            enable-wrap
          >
            <Nuxt />
          </UiChatScroll>
          <Enhancers :sidebar="showSidebar" />
          <WalletMini v-if="ui.modals.walletMini" />
          <ChatbarCommandsPreview :message="ui.chatbarContent" />
          <Chatbar :recipient="recipient" />
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
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'

export default Vue.extend({
  name: 'ChatLayout',
  components: {
    MenuIcon,
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
    ...mapState(['audio', 'ui', 'media', 'friends']),
    ...mapGetters('ui', ['showSidebar']),
    selectedGroup() {
      return this.$route.params.id // TODO: change with groupid - AP-400
    },
    recipient() {
      // It should not happen that someone tries to write to himself, but we should check
      // anyway
      const isMe =
        this.$route.params.address === this.$typedStore.state.accounts.active

      const recipient = isMe
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
    this.$store.dispatch('ui/activateKeybinds')
    this.$Sounds.changeLevels(this.audio.volume / 100)
    this.$store.commit('ui/setTypingUser', this.$mock.users[0])

    const appHeight = () => {
      const doc = document.documentElement
    }
    window.addEventListener('resize', appHeight)
    appHeight()
    this.showInitialSidebar()
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
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
