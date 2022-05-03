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
        :users="friends.all"
        :groups="$mock.groups"
        :sidebar="showSidebar"
        :show-menu="toggleMenu"
      />
      <Sidebar
        v-if="!$device.isMobile"
        :users="friends.all"
        :groups="$mock.groups"
        :sidebar="showSidebar"
        :show-menu="toggleMenu"
      />
    </swiper-slide>
    <swiper-slide class="dynamic-content">
      <DroppableWrapper @handle-drop-prop="handleDrop">
        <menu-icon
          v-if="!showSidebar || $device.isMobile"
          class="toggle--sidebar"
          size="1.2x"
          full-width
          @click="toggleMenu"
        />
        <Nuxt id="files" ref="files" />
      </DroppableWrapper>
    </swiper-slide>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import DroppableWrapper from '~/components/ui/DroppableWrapper/DroppableWrapper.vue'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import { SettingsRoutes } from '~/store/ui/types'
import DefaultLayout from '~/layouts/default.vue'

export default Vue.extend({
  name: 'FilesLayout',
  components: {
    MenuIcon,
    DroppableWrapper,
    DefaultLayout,
  },
  mixins: [Touch, Layout],
  middleware: 'authenticated',
  computed: {
    ...mapState(['friends', 'settings']),
    ...mapGetters('ui', ['showSidebar', 'getFilesIndexLoading']),
  },
  watch: {
    $route() {
      this.showInitialSidebar()
    },
  },
  mounted() {
    this.showInitialSidebar()
  },
  methods: {
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.showSidebar)
    },
    showInitialSidebar() {
      if (this.$device.isMobile && !this.$route.query?.sidebar) {
        this.$store.commit('ui/showSidebar', false)
        return
      }
      this.$store.commit('ui/showSidebar', true)
    },
    /**
     * @method handleDrop
     * @description Allows the drag and drop of files into the filesystem
     * @param e Drop event data object
     */
    handleDrop(e: DragEvent) {
      e.preventDefault()

      if (!this.settings.consentScan) {
        this.$toast.error(
          this.$t('pages.files.errors.enable_consent') as string,
          {
            duration: 3000,
          },
        )
        this.$store.commit('ui/toggleSettings', {
          show: true,
          defaultRoute: SettingsRoutes.PRIVACY,
        })
        return
      }

      // if already uploading, return to prevent bucket fast-forward crash
      if (this.isFilesIndexLoading) {
        this.$toast.show(this.$t('pages.files.errors.in_progress') as string)
        return
      }
      if (e?.dataTransfer) {
        const files: (File | null)[] = [...e.dataTransfer.items].map((f) =>
          f.getAsFile(),
        )
        this.$refs.files.$children[0].$refs.controls.handleFile(files)
      }
    },
  },
})
</script>
