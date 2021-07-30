<template src="./friends/Friends.html"></template>

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
})
</script>

<style lang="less" src="./friends/Friends.less"></style>
