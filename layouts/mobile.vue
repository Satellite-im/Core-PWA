<template>
  <div
    id="app"
    :class="[`theme-${settings.theme}`, { 'hidden-nav': !isMobileNavVisible }]"
  >
    <Nuxt />
    <MobileNav />
    <UiGlobal />
    <v-style>
      :root { --flair-color: {{ flair.primary }}; --flair-color-secondary:
      {{ flair.secondary }}; --flair-color-rgb: {{ flair.primaryRGB }}; }
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs, Flair } from '~/libraries/Iridium/settings/types'
import 'swiper/css'
import { RootState } from '~/types/store/store'
import { Conversation } from '~/libraries/Iridium/chat/types'

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
    conversationId(): Conversation['id'] {
      return this.$route.params.id
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

  &.has-background-call {
    position: relative;
    padding-top: @background-call-height;
  }
}
</style>
