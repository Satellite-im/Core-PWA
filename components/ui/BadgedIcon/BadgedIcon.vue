<template src="./BadgedIcon.html" />
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    /**
     * Supported fontawesome icon
     *
     * @remarks
     * You must make sure we have imported the icon before using it. See /plugins/fontawesome.ts
     */
    // eslint-disable-next-line vue/require-default-prop
    icon: {
      type: String,
      required: false,
    },
    /**
     * Number to display on the top right of the icon
     */
    badgeCount: {
      type: Number,
      required: true,
    },
    /**
     * Font size of the icon
     */
    size: {
      type: Number,
      default: 12,
      required: false,
    },
    color: {
      type: String,
      default: '',
      required: false,
    },
  },
})
</script>
<style scoped lang="less" src="./BadgedIcon.less"></style>
