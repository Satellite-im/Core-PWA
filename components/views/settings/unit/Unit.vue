<template src="./Unit.html" />
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    text: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    breakLine: {
      type: Boolean,
      default: true,
    },
  },
})
</script>
