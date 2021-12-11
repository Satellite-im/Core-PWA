<template>
  <div id="app-wrap" :class="`${sidebar ? 'is-open' : 'is-collapsed'}`">
    <div
      id="app"
      :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
        $device.isMobile ? 'mobile-app' : ''
      }`"
      v-touch:swipe="sidebarSwipeHandler(this)"
      v-touch-options="{ swipeTolerance: 75 }"
    >
      <UiGlobal />
      <TailoredCoreSlimbar
        :servers="$mock.servers"
        :unreads="$mock.unreads"
        :openModal="toggleModal"
      />
      <TailoredServersSidebar
        :toggle="() => ($data.sidebar = !$data.sidebar)"
      />
      <TailoredMessagingEnhancers />
      <div
        :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`"
      >
        <TailoredCoreStatusbar
          id="statusbar"
          :server="{
            name: 'Test Server',
            address: '0x0',
            desc: 'Just a test server',
          }"
          :user="$mock.users[0]"
        />
        <TailoredCoreMedia
          :fullscreen="ui.fullscreen"
          :users="$mock.callUsers"
          :maxViewableUsers="10"
          :fullscreenMaxViewableUsers="20"
        />
        <UiChatScroll
          :contents="ui.messages"
          :preventScrollOffset="500"
          :class="media.activeCall ? 'media-open' : ''"
          enableWrap
        >
          <Nuxt />
        </UiChatScroll>
        <TailoredCoreChatbar />
      </div>
    </div>
    <TailoredCoreMobileNav v-if="$device.isMobile" />
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
