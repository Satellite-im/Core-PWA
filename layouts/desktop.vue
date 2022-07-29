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
    <UiDroppableWrapper v-if="displayDroppable" @handle-drop-prop="handleDrop">
      <Nuxt ref="page" class="page" />
    </UiDroppableWrapper>
    <Nuxt v-else class="page" />
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
import { ChatbarRef } from '~/components/views/chat/chatbar/Chatbar.vue'
import { FilesControlsRef } from '~/components/views/files/controls/Controls.vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs, Flair } from '~/libraries/Iridium/settings/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'Desktop',
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
    consentToScan(): boolean {
      return iridium.settings.state.privacy.consentToScan
    },
    displayDroppable(): boolean {
      return (
        this.$route.path.includes('files') || this.$route.path.includes('chat')
      )
    },
  },
  methods: {
    /**
     * @method handleDrop
     * @description Allows the drag and drop of files into the chatbar
     * @param e Drop event data object
     * @example v-on:drop="handleDrop"
     */
    handleDrop(e: DragEvent) {
      e.preventDefault()
      if (!e?.dataTransfer) {
        return
      }
      if (!this.consentToScan) {
        this.$store.dispatch('ui/displayConsentSettings')
        return
      }
      const childRefs = (this.$refs.page as Vue).$children[0].$refs
      if (childRefs.chatbar) {
        ;(childRefs.chatbar as ChatbarRef).handleUpload([
          ...e.dataTransfer.items,
        ])
      } else if (childRefs.controls) {
        const files = [...e.dataTransfer.items].map((f) => f.getAsFile())
        ;(childRefs.controls as FilesControlsRef).handleFile(files)
      }
    },
  },
})
</script>

<style lang="less" scoped>
#app {
  display: flex;
  height: 100%;
  inset: 0;
  position: absolute;
  transition: left @animation-speed-long ease;

  &.hide-sidebars {
    left: calc(calc(@sidebar-width + @slimbar-width) * -1);
  }

  .page {
    padding: @normal-spacing @normal-spacing 0;
  }
}
</style>
