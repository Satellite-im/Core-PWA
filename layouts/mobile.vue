<template>
  <div
    id="app"
    :class="[`theme-${settings.theme}`, { 'hidden-nav': !isMobileNavVisible }]"
  >
    <Nuxt :class="{ padded: isPadded }" />
    <MobileNav />
    <UiGlobal />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs, Flair } from '~/libraries/Iridium/settings/types'
import 'swiper/css'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'Mobile',
  data() {
    return {
      settings: iridium.settings.state,
    }
  },
  computed: {
    ...mapState({
      isMobileNavVisible: (state) => (state as RootState).ui.isMobileNavVisible,
    }),
    flair(): Flair {
      return flairs[this.settings.flair]
    },
    isPadded(): boolean {
      return (
        this.$route.path.includes('files') ||
        this.$route.path.includes('friends')
      )
    },
  },
})
</script>

<style lang="less" scoped>
#app {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding-bottom: @mobile-nav-height;
  transition: padding @animation-speed-long ease;

  &.hidden-nav {
    padding-bottom: 0;
  }

  .padded {
    padding: @normal-spacing;
  }
}
</style>
