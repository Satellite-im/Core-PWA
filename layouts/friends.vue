<template>
  <default-layout>
    <swiper-slide class="sidebar-container">
      <Slimbar
        v-if="!$device.isMobile"
        :servers="$mock.servers"
        :unreads="friends.all"
        :open-modal="toggleModal"
      />
      <MobileSidebar
        v-if="$device.isMobile"
        :show-menu="toggleMenu"
        :users="friends.all"
        :groups="$mock.groups"
        :sidebar="showSidebar"
      />
      <Sidebar
        v-if="!$device.isMobile"
        :show-menu="toggleMenu"
        :users="friends.all"
        :groups="groups.all"
        :sidebar="showSidebar"
      />
    </swiper-slide>
    <swiper-slide class="dynamic-content">
      <menu-icon
        v-if="!$device.isMobile"
        class="toggle--sidebar"
        size="1.2x"
        full-width
        :style="`${!showSidebar ? 'display: block' : 'display: none'}`"
        @click="toggleMenu"
      />
      <Nuxt id="friends" ref="chat" />
    </swiper-slide>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import DefaultLayout from '~/layouts/default.vue'

export default Vue.extend({
  name: 'ChatLayout',
  components: {
    MenuIcon,
    DefaultLayout,
  },
  mixins: [Touch, Layout],
  layout: 'default',
  middleware: 'authenticated',
  computed: {
    ...mapState(['friends', 'groups']),
    ...mapGetters('ui', ['showSidebar']),
  },
  methods: {
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.showSidebar)
    },
  },
})
</script>
