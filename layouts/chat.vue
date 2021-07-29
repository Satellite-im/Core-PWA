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
<<<<<<< HEAD
  mounted() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 400)
    this.$Sounds.changeLevels(this.$store.state.audio.volume / 100)
  },
  updated() {
    // this.scrollToBottom()
  },
=======
>>>>>>> 7299f680bad499f0bc7159cb43a0944afcf51dda
  methods: {
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
