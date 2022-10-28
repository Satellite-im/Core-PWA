<template>
  <button
    data-cy="hamburger-button"
    aria-hidden="true"
    tabindex="-1"
    @click="toggleMenu"
  >
    <menu-icon class="button-icon" size="1.5x" />
  </button>
</template>

<script setup lang="ts">
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { MenuIcon } from 'satellite-lucide-icons'

const { $store } = useNuxtApp()

function toggleMenu() {
  $store.commit('ui/showSidebar', !$store.state.ui.showSidebar)
}
</script>

<style scoped lang="less">
button {
  color: @flair-color;
  display: flex;
  align-items: center;
  align-self: center;
}
</style>
