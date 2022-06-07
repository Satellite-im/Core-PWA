<template src="./Footer.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { CircleIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    CircleIcon,
  },
  props: {
    charlimit: {
      type: Boolean,
    },
    usersTyping: {
      type: Array,
      default: () => [{ name: 'Phoenix' }, { name: 'Ariel' }],
      required: false,
    },
    typing: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    lengthCount() {
      return `${this.ui.chatbarContent.length}/${this.$Config.chat.maxChars}`
    },
  },
})
</script>

<style scoped lang="less" src="./Footer.less"></style>
