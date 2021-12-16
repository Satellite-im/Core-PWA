<template>
  <div id="app-wrap" :class="sidebar ? 'is-open' : 'is-collapsed'">
    <div
      id="app"
      v-touch:swipe="sidebarSwipeHandler(this)"
      :class="[
        sidebar ? 'is-open' : 'is-collapsed',
        $device.isMobile ? 'mobile-app' : '',
      ]"
    >
      <UiGlobal />

      <Slimbar
        :servers="$mock.servers"
        :unreads="$mock.unreads"
        :open-modal="toggleModal"
      />
      <Sidebar
        :toggle="() => ($data.sidebar = !$data.sidebar)"
        :users="friends.all"
        :groups="$mock.groups"
      />
      <div class="dynamic-content">
        <Nuxt id="files" ref="files" />
      </div>
    </div>
    <MobileNav v-if="$device.isMobile" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'

export default Vue.extend({
  name: 'FilesLayout',
  mixins: [Touch, Layout],
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
