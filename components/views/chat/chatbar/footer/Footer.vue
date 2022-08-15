<template src="./Footer.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { CircleIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    CircleIcon,
  },
  props: {
    peerActive: {
      type: Boolean,
      required: true,
    },
    charlimit: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    ...mapGetters('conversation', ['typingParticipants']),
    lengthCount() {
      return `${this.ui.chatbarContent.length}/${this.$Config.chat.maxChars}`
    },
  },
})
</script>

<style scoped lang="less" src="./Footer.less"></style>
