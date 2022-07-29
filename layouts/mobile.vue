<template>
  <div id="app" :class="[`theme-${settings.theme}`]">
    <Nuxt :class="{ padded: isPadded }" />
    <MobileNav />
    <UiGlobal />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs, Flair } from '~/libraries/Iridium/settings/types'
import 'swiper/css'

export default Vue.extend({
  name: 'Mobile',
  data() {
    return {
      settings: iridium.settings.state,
    }
  },
  computed: {
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

  .padded {
    padding: @normal-spacing;
  }
}
</style>
