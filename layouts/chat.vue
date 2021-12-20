<template>
  <div
    id="app-wrap"
    :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
      asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside'
    } ${selectedGroup ? 'active-group' : null}`"
  >
    <div
      id="app"
      :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
        asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside'
      } ${selectedGroup ? 'group' : 'direct'} ${
        $device.isMobile ? 'mobile-app' : ''
      }`"
    >
      <UiGlobal />
      <Slimbar
        :servers="$mock.servers"
        :unreads="$mock.unreads"
        :open-modal="toggleModal"
      />
      <swiper class="swiper" :options="swiperOption" ref="swiper">
        <swiper-slide class="sidebar-container">
          <Sidebar
            :users="friends.all"
            :groups="$mock.groups"
            :showMenu="toggleMenu"
          />
        </swiper-slide>
        <swiper-slide :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`">
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
        <!-- <swiper-slide class="aside-container">
          <GroupAside
            :toggle="() => ($data.asidebar = !$data.asidebar)"
            :selected-group="
              $mock.groups.find((group) => group.address === selectedGroup)
            "
            :friends="$mock.friends"
          />
        </swiper-slide> -->
      </swiper>
    </div>
    <MobileNav v-if="$device.isMobile" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'
import Layout from '~/components/mixins/Layouts/Layout'

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default Vue.extend({
  name: 'ChatLayout',
  mixins: [mobileSwipe, Layout],
  middleware: 'authenticated',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      sidebar: true,
      asidebar: !this.$device.isMobile,
      swiperOption: {
        initialSlide: 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        on: {
          slideChange: () => {
            this.sidebar = this.swiper.activeIndex === 0
          }
        }
      }
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
    swiper() {
      return this.$refs.swiper.$swiper
    },
  },
  mounted() {
    this.$store.dispatch('ui/activateKeybinds')
    this.$Sounds.changeLevels(this.audio.volume / 100)
    this.$store.commit('ui/setTypingUser', this.$mock.users[0])

    const appHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', appHeight)
    appHeight()
  },
  methods: {
    toggleMenu() {
      console.log('toggleMenu')
      if(this.swiper) {
        this.$data.sidebar
          ? this.swiper.slideNext()
          : this.swiper.slidePrev()
      }
    }
  }
})
</script>

<style lang="less" src="./Layout.less"></style>
