<template src="./Chat.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ServerChat',
  layout: 'server',
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    setTimeout(() => {
      this.$data.loading = false
    }, 3000)
    this.$store.dispatch('fetchFriends')
  },
})
</script>
