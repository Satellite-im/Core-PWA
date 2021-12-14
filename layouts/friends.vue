<template>
  <div id="app-wrap"
:class="`${sidebar ? 'is-open' : 'is-collapsed'}`">
    <div
      id="app"
      v-touch:swipe="sidebarSwipeHandler(this)"
      v-touch-options="{ swipeTolerance: 75 }"
      :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
        $device.isMobile ? 'mobile-app' : ''
      }`"
    >
      <UiGlobal />

      <ViewsNavigationSlimbar
        :servers="$mock.servers"
        :unreads="$mock.unreads"
        :open-modal="toggleModal"
      />
      <ViewsNavigationSidebar
        :toggle="() => ($data.sidebar = !$data.sidebar)"
        :users="friends.all"
        :groups="$mock.groups"
      />
      <div class="dynamic-content">
        <Nuxt id="friends"
ref="chat" />
      </div>
    </div>
    <ViewsNavigationMobileNav v-if="$device.isMobile" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'
import Layout from '~/components/mixins/Layouts/Layout'

export default Vue.extend({
  name: 'ChatLayout',
  mixins: [mobileSwipe, Layout],
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
    }
  },
  computed: {
    ...mapState(['friends']),
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
