<template src="./Developer.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'DeveloperSettings',
  layout: 'settings',
  computed: {
    ...mapState(['accounts']),
  },
})
</script>
