<template src="./LoadingInline.html"></template>
<script lang="ts">
import Vue from 'vue'

// @ts-ignore
import { LoaderIcon } from 'vue-feather-icons'

export default Vue.extend({
  components: {
    LoaderIcon,
  },
  props: {
    text: {
      type: String,
      default: 'Loading...',
    },
    muted: {
      type: Boolean,
      default: false,
    },
    spaced: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
<style scoped lang="less" src="./LoadingInline.less"></style>
