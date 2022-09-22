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
      required: true,
    },
  },
  computed: {
    ...mapState({
      chatbarContent: (state) => (state as RootState).ui.chatbarContent,
    }),
    lengthCount() {
      return `${this.chatbarContent.length}/${this.$Config.chat.maxChars}`
    },
  },
})
</script>

<style scoped lang="less" src="./Footer.less"></style>
