<template>
  <div id="app" :class="`theme-${theme}`">
    <UiModal
      v-if="$store.state.ui.modals.errorNetwork.isOpen"
      :show-close-button="false"
    >
      <UiPopupsErrorNetwork />
    </UiModal>
    <Nuxt />
    <v-style>
      :root { --flair-color: {{ flair.primary }}; --flair-color-secondary:
      {{ flair.secondary }}; --flair-color-rgb: {{ flair.primaryRGB }}; }
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import useMeta from '~/components/compositions/useMeta'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs } from '~/libraries/Iridium/settings/types'

export default Vue.extend({
  middleware: ['safearea'],

  setup() {
    useMeta()
    const flair = flairs[iridium.settings.state.flair]
    const theme = iridium.settings.state.theme

    return { flair, theme }
  },
})
</script>

<style lang="less" scoped>
#app {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow-y: auto;

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
