<template src="./Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ChatbarRef } from '~/components/views/chat/chatbar/Chatbar.vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'Chat',
  layout: 'basic',

  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    consentToScan(): boolean {
      return iridium.settings.state.privacy.consentToScan
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
      if (!this.consentToScan) {
        this.$store.dispatch('ui/displayConsentSettings')
        return
      }
      if (e?.dataTransfer && this.$refs.chatbar) {
        ;(this.$refs.chatbar as ChatbarRef).handleUpload([
          ...e.dataTransfer.items,
        ])
      }
    },
  },
})
</script>

<style lang="less" src="./Chat.less"></style>
