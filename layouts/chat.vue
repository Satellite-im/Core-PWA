<template src="./chat/Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mobileSwipe } from '../components/mixins/Swipe/Swipe'

export default Vue.extend({
  name: 'ChatLayout',
  mixins: [mobileSwipe],
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
      const container = (this.$refs.chat as Vue).$el as Element
      container.scrollTop = container.scrollHeight
    },
    toggleModal() {
      this.$store.commit('toggleModal', {
        name: 'createServer',
        state: !this.$store.state.ui.modals.createServer,
      })
    },
    acceptCall() {
      this.$store.dispatch('acceptCall')
    },
    denyCall() {
      this.$store.dispatch('denyCall')
    },
  },
})
</script>

<style lang="less" src="./chat/Chat.less"></style>
