<template>
  <div
    id="app"
    :class="[
      `theme-${settings.theme}`,
      {
        'hide-sidebars': !showSidebar,
      },
    ]"
  >
    <Slimbar />
    <Sidebar />
    <UiDroppableWrapper
      :disabled="!displayDroppable"
      @handle-drop-prop="handleDrop"
    >
      <Nuxt ref="page" />
    </UiDroppableWrapper>
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
import { mapState } from 'vuex'
import useMeta from '~/components/compositions/useMeta'
import { ChatbarRef } from '~/components/views/chat/chatbar/Chatbar.vue'
import { FilesControlsRef } from '~/components/views/files/controls/Controls.vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs, Flair } from '~/libraries/Iridium/settings/types'
import { RootState } from '~/types/store/store'
import { notNull } from '~/utilities/typeGuard'

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
    flair(): Flair {
      return flairs[this.settings.flair]
    },
    consentToScan(): boolean {
      return iridium.settings.state.privacy.consentToScan
    },
    displayDroppable(): boolean {
      const droppablePages = ['/files', '/chat']
      const match = droppablePages.filter((path) =>
        this.$route.path.includes(path),
      ).length
      return Boolean(match)
    },
    ready(): boolean {
      return iridium.ready && !!iridium.profile.state?.did
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
      if (!this.displayDroppable) return

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
        const files = [...e.dataTransfer.items]
          .map((f) => f.getAsFile())
          .filter(notNull)
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
}
</style>
