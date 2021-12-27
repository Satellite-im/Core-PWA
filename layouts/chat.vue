<template>
  <div
    id="app-wrap"
    :class="`${$store.state.ui.theme.base.class}
    ${sidebar ? 'is-open' : 'is-collapsed'} ${
      asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside'
    } ${selectedGroup ? 'active-group' : null}`"
  >
    <div
      id="app"
      :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
        asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside'
      } ${selectedGroup ? 'group' : 'direct'} ${
        $device.isMobile ? 'mobile-app' : 'desktop'
      }`"
    >
      <UiGlobal />
      <swiper class="swiper" :options="swiperOption" ref="swiper">
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
            :showMenu="toggleMenu"
            :sidebar="sidebar"
          />
        </swiper-slide>
        <swiper-slide
          :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`"
        >
          <menu-icon
            class="toggle--sidebar"
            v-on:click="toggleMenu"
            size="1.2x"
            full-width
            :style="`${!sidebar ? 'display: block' : 'display: none'}`"
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
            :class="media.activeCall ? 'media-open' : ''"
            enable-wrap
          >
            <Nuxt />
          </UiChatScroll>
          <Enhancers />
          <WalletMini v-if="ui.modals.walletMini" />
          <ChatbarCommandsPreview :message="ui.chatbarContent" />
          <ChatbarReply v-if="recipient" />
          <Chatbar :recipient="recipient" />
        </swiper-slide>
        <swiper-slide class="aside-container" v-if="$data.asidebar">
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
import { mapState } from 'vuex'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'

import { MenuIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'ChatLayout',
  mixins: [Touch, Layout],
  middleware: 'authenticated',
  components: {
    MenuIcon,
  },
  data() {
    return {
      sidebar: true,
      asidebar: !this.$device.isMobile,
      swiperOption: {
        initialSlide: 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: this.$device.isMobile ? false : true,
        allowTouchMove: this.$device.isMobile ? true : false,
        on: {
          slideChange: () => {
            this.$data.sidebar = this.$refs.swiper.$swiper.activeIndex === 0
            this.$data.asidebar = this.$refs.swiper.$swiper.activeIndex === 2
          },
        },
      },
    }
  },
  computed: {
    ...mapState(['audio', 'ui', 'media', 'friends']),
    selectedGroup() {
      return this.$route.params.id // TODO: change with groupid
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
  mounted() {
    this.$store.dispatch('ui/activateKeybinds')
    this.$Sounds.changeLevels(this.audio.volume / 100)
    this.$store.commit('ui/setTypingUser', this.$mock.users[0])

    const appHeight = () => {
      const doc = document.documentElement
    }
    window.addEventListener('resize', appHeight)
    appHeight()
  },
  methods: {
    toggleMenu() {
      if (this.$refs.swiper.$swiper) {
        this.$data.sidebar
          ? this.$refs.swiper.$swiper.slideNext()
          : this.$refs.swiper.$swiper.slidePrev()
      }
    },
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
