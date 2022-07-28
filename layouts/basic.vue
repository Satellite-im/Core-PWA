<template>
  <div
    id="app"
    :class="[
      `theme-${settings.theme}`,
      {
        'has-background-call': isBackgroundCall,
        'hide-sidebars': !showSidebar,
      },
    ]"
  >
    <Slimbar :servers="$mock.servers" />
    <Sidebar />
    <Nuxt />
    <UiGlobal />
    <!-- Sets the global css variable for the theme flair color -->
    <v-style>
      :root { --flair-color: {{ flair.primary }}; --flair-color-secondary:
      {{ flair.secondary }}; --flair-color-rgb: {{ flair.primaryRGB }}; }
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import useMeta from '~/components/compositions/useMeta'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs, Flair } from '~/libraries/Iridium/settings/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'BasicLayout',
  middleware: 'authenticated',
  setup() {
    useMeta()
  },
  data() {
    return {
      settings: iridium.settings.state,
    }
  },
  computed: {
    ...mapState({
      showSidebar: (state) => (state as RootState).ui.showSidebar,
    }),
    ...mapGetters('webrtc', ['isBackgroundCall']),
    flair(): Flair {
      return flairs[this.settings.flair]
    },
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
