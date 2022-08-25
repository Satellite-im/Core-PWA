<template src="./Developer.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'InfoSettings',
  layout: 'settings',
  computed: {
    ...mapState(['accounts']),
  },
})
</script>
