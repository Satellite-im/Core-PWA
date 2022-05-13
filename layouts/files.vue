<template>
  <div
    id="app-wrap"
    :class="`${showSidebar ? 'is-open' : 'is-collapsed'} ${
      $store.state.ui.theme.base.class
    }`"
  >
    <div
      id="app"
      :class="[
        showSidebar ? 'is-open' : 'is-collapsed',
        $device.isMobile ? 'mobile-app' : 'desktop',
      ]"
    >
      <UiGlobal />

      <swiper ref="swiper" class="swiper" :options="swiperOption">
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
      </swiper>
    </div>
    <MobileNav v-if="$device.isMobile" />
    <!-- Sets the global css variable for the theme flair color -->
    <v-style>
      :root { --flair-color: {{ flairColor[0] }}; --flair-color-secondary:
      {{ flairColor[1] }}; --flair-color-rgb:{{ flairColor[2] }};}
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import DroppableWrapper from '~/components/ui/DroppableWrapper/DroppableWrapper.vue'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import useMeta from '~/components/compositions/useMeta'
import { SettingsRoutes } from '~/store/ui/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'FilesLayout',
  components: {
    MenuIcon,
    DroppableWrapper,
  },
  mixins: [Touch, Layout],
  middleware: 'authenticated',
  setup() {
    useMeta()
  },
  data() {
    return {
      sidebar: !this.$device.isMobile,
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
            }
          },
        },
      },
    }
  },
  computed: {
    ...mapState({
      friends: (state) => (state as RootState).friends,
      consentToScan: (state) =>
        (state as RootState).textile.userThread.consentToScan,
    }),
    ...mapGetters('ui', ['showSidebar', 'isFilesIndexLoading']),
    flairColor(): string {
      return this.$store.state.ui.theme.flair.value
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

      if (!this.consentToScan) {
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

<style lang="less" src="./Layout.less"></style>
