<template>
  <div id="app-wrap" :class="`${sidebar ? 'is-open' : 'is-collapsed'}`">
    <div
      id="app"
      v-touch:swipe="sidebarSwipeHandler(this)"
      v-touch-options="{ swipeTolerance: 75 }"
      :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
        $device.isMobile ? 'mobile-app' : ''
      }`"
    >
      <UiGlobal />
      <Slimbar
        :servers="$mock.servers"
        :unreads="$mock.unreads"
        :open-modal="toggleModal"
      />
      <ServerSidebar
        :toggle="() => ($data.sidebar = !$data.sidebar)"
      />
      <Enhancers />
      <div
        :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`"
      >
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
          :prevent-scroll-offset="500"
          :class="media.activeCall ? 'media-open' : ''"
          enable-wrap
        >
          <Nuxt />
        </UiChatScroll>
        <Chatbar />
      </div>
    </div>
    <MobileNav v-if="$device.isMobile" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import Layout from '~/components/mixins/Layouts/Layout'
import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'

export default Vue.extend({
  name: 'ServerLayout',
  mixins: [mobileSwipe, Layout],
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
    }
  },
  computed: {
    ...mapState(['ui', 'media']),
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
