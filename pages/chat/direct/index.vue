<template src="./Direct.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DirectMessages',
  layout: 'chat',
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    setTimeout(() => {
      this.$data.loading = false
    }, 1500)
  },
})
</script>
