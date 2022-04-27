<template src="./Modal.html"></template>

<script lang="ts">
import { MenuIcon } from 'satellite-lucide-icons'
import Vue from 'vue'
import { mapState } from 'vuex'
import { SettingsRoutes } from '~/store/ui/types'

type Swiper = {
  $swiper: {
    slideNext: () => void
    slidePrev: () => void
  }
}

export default Vue.extend({
  components: {
    MenuIcon,
  },
  data() {
    return {
      settingSwiperOption: {
        initialSlide: 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: !this.$device.isMobile,
        allowTouchMove: this.$device.isMobile,
      },
      SettingsRoutes,
    }
  },
  computed: {
    ...mapState(['ui']),
    verticalScroll(): boolean {
      return !this.ui.modals.crop
    },
  },
  watch: {
    'ui.showSettings': {
      handler(newSValue) {
        if (newSValue && this.$device.isMobile) {
          setTimeout(() => {
            this.changeRoute('profile')
          }, 100)
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.showSidebar(false)
  },
  methods: {
    /**
     * Opens and closes the left hand sidebar
     */
    /**
     * @method toggleSidebar DocsTODO
     * @description
     * @example
     */
    toggleSidebar() {
      const $swiper = (this.$refs.settingSwiper as Vue & Swiper)?.$swiper
      !this.ui.settingsSideBar ? $swiper.slideNext() : $swiper.slidePrev()
      this.$store.commit('ui/toggleSettingsSidebar', !this.ui.settingsSideBar)
    },
    /**
     * @method showSidebar DocsTODO
     * @description
     * @example
     */
    showSidebar(show: Boolean) {
      const $swiper = (this.$refs.settingSwiper as Vue & Swiper)?.$swiper
      if ($swiper) {
        if (show) {
          $swiper.slideNext()
          return
        }
        $swiper.slidePrev()
      }
      this.$store.commit('ui/toggleSettingsSidebar', show)
    },
    /**
     * @method changeRoute DocsTODO
     * @description
     * @param route
     * @example
     */
    changeRoute(route: string) {
      this.$store.commit('ui/setSettingsRoute', route)
      if (this.$device.isMobile) {
        this.showSidebar(true)
      }
    },
    /**
     * @method closeModal DocsTODO
     * @description
     * @example
     */
    closeModal() {
      this.$store.commit('ui/toggleSettings', { show: false })
    },
  },
})
</script>

<style scoped lang="less" src="./Modal.less"></style>
<style lang="less">
#settings {
  width: 90vw;
  height: 90vh;
}
#settings.is-collapsed
  > div.sidebar.is-secondary-background
  > section
  > div.aside-menu.hidden-scroll
  > svg {
  right: 0.9rem !important;
}
#settings.is-collapsed
  > div.sidebar.is-secondary-background
  > section
  > div.aside-menu.hidden-scroll
  > aside {
  display: none;
}
</style>
