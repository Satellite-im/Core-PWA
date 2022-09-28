<template>
  <div id="app" :class="`theme-${iridium.settings.state.theme}`">
    <UiModal v-if="$store.state.ui.modals.errorNetwork.isOpen">
      <UiPopupsErrorNetwork />
    </UiModal>
    <Nuxt />
    <v-style>
      :root { --flair-color: {{ flair.primary }}; --flair-color-secondary:
      {{ flair.secondary }}; --flair-color-rgb: {{ flair.primaryRGB }}; }
    </v-style>
  </div>
</template>

<script setup lang="ts">
import useMeta from '~/components/compositions/useMeta'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs } from '~/libraries/Iridium/settings/types'

const flair = flairs[iridium.settings.state.flair]

useMeta()
</script>

<style lang="less" scoped>
#app {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
}
</style>
