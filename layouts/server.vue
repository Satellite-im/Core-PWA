<template>
  <default-layout>
    <swiper-slide class="sidebar-container">
      <Slimbar
        v-if="!$device.isMobile"
        :servers="$mock.servers"
        :unreads="friends.all"
        :open-modal="toggleModal"
      />
      <ServerSidebar
        :toggle="() => ($data.sidebar = !$data.sidebar)"
        :show-menu="toggleMenu"
        :sidebar="sidebar"
      />
      <Enhancers />
    </swiper-slide>
    <swiper-slide
      :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`"
    >
      <menu-icon
        class="toggle--sidebar"
        size="1.2x"
        full-width
        :style="`${!sidebar ? 'display: block' : 'display: none'}`"
        @click="toggleMenu"
      />
      <Toolbar
        id="toolbar"
        :server="{
          name: 'Test Server',
          address: '0x0',
          desc: 'Just a test server',
        }"
        :user="$mock.users[0]"
      />
      <Media
        :fullscreen="ui.fullscreen"
        :users="$mock.callUsers"
        :max-viewable-users="10"
        :fullscreen-max-viewable-users="20"
      />
      <UiChatScroll
        :contents="ui.messages"
        :prevent-scroll-offset="10"
        :class="media.activeCall ? 'media-open' : ''"
        enable-wrap
      >
        <Nuxt />
      </UiChatScroll>
      <Chatbar />
    </swiper-slide>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import DefaultLayout from '~/layouts/default.vue'

export default Vue.extend({
  name: 'ServerLayout',
  components: {
    MenuIcon,
    DefaultLayout,
  },
  mixins: [Touch, Layout],
  middleware: 'authenticated',
  computed: {
    ...mapState(['ui', 'media']),
  },
  methods: {
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.showSidebar)
    },
  },
})
</script>
