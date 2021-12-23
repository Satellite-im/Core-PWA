<template src="./Modal.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  MenuIcon,
} from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    MenuIcon
  },
  data() {
    return {
      page: 'personalize',
      sidebar: true,
      settingSwiperOption: {        
        initialSlide: 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: this.$device.isMobile ? false : true,
        allowTouchMove:  this.$device.isMobile ? true : false,
        on: {
          slideChange: () => {
            this.$store.commit('ui/toggleSettingsSidebar', this.$refs.settingSwiper.$swiper.activeIndex === 0)
            this.$data.sidebar = this.$refs.settingSwiper.$swiper.activeIndex === 0
          }
        }
      },
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    this.$store.commit('ui/toggleSettingsSidebar', true)
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
      if (this.$refs.settingSwiper.$swiper) {
        this.ui.settingsSideBar 
          ? this.$refs.settingSwiper.$swiper.slideNext() 
          : this.$refs.settingSwiper.$swiper.slidePrev()
      }
    },
    /**
     * @method showSidebar DocsTODO
     * @description
     * @example
     */
    showSidebar() {
      this.$store.commit('ui/toggleSettingsSidebar', true)
    },
    /**
     * @method collapseSidebar DocsTODO
     * @description
     * @example
     */
    collapseSidebar() {
      this.$store.commit('ui/toggleSettingsSidebar', false)
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
        this.collapseSidebar()
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
