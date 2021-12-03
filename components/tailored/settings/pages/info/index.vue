<template src="./Developer.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'DeveloperSettings',
  layout: 'settings',
  computed: {
    ...mapState(['accounts']),
    window() {
      return window
    },
  },
})
</script>
