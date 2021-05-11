<template src="./chat/Chat.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Chat',
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
    }
  },
  mounted() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 400)
  },
  updated() {
    this.scrollToBottom()
  },
  methods: {
    scrollToBottom() {
      // @ts-ignore
      const container = this.$refs.chat.$el
      // @ts-ignore
      container.scrollTop = container.scrollHeight
    },
  },
})
</script>

<style lang="less" src="./chat/Chat.less"></style>
