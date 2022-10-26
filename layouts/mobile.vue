<template>
  <div
    id="app"
    :class="[`theme-${settings.theme}`, { 'hidden-nav': !isMobileNavVisible }]"
  >
    <UiBackgroundCall v-if="isBackgroundCall" />
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
import useMeta from '~/components/compositions/useMeta'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs, Flair } from '~/libraries/Iridium/settings/types'
import 'swiper/css'
import { RootState } from '~/types/store/store'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  name: 'Mobile',
  middleware: ['safearea'],
  setup() {
    useMeta()
  },
  data() {
    return {
      settings: iridium.settings.state,
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState({
      isMobileNavVisible: (state) => (state as RootState).ui.isMobileNavVisible,
    }),
    isBackgroundCall(): boolean {
      return iridium.webRTC.isBackgroundCall(this.$route.params.id)
    },
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
  padding-bottom: max(
    calc(var(--safe-area-inset-bottom) + @mobile-nav-height),
    var(--keyboard-height, 0px)
  );
  padding-top: var(--safe-area-inset-top);

  &.hidden-nav {
    padding-bottom: max(
      var(--safe-area-inset-bottom),
      var(--keyboard-height, 0px)
    );
  }
}
</style>
