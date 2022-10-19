<template>
  <button data-cy="hamburger-button" @click="toggleMenu">
    <menu-icon
      class="button-icon"
      size="1.5x"
      :alt="$tc('global.sidebar', Number($store.state.ui.showSidebar))"
    />
  </button>
</template>

<script setup lang="ts">
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
