<template src="./Modal.html"></template>

<script lang="ts">
import { MenuIcon } from 'satellite-lucide-icons'
import Vue from 'vue'
import { mapState } from 'vuex'

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
      page: 'personalize',
      settingSwiperOption: {
        initialSlide: 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: !this.$device.isMobile,
        allowTouchMove: !!this.$device.isMobile,
      },
    }
  },
  computed: {
    ...mapState(['ui']),
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
      show ? $swiper.slideNext() : $swiper.slidePrev()
      this.$store.commit('ui/toggleSettingsSidebar', show)
    },
    /**
     * @method changeRoute DocsTODO
     * @description
     * @param route
     * @example
     */
    changeRoute(route: string) {
      this.$data.page = route
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
      this.$store.commit('ui/toggleSettings', false)
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
