<template>
  <div />
</template>
<script>
import Vue from 'vue'
export default {
  mounted() {
    this.$store.commit('ui/toggleSettings', { show: false }) // Hide settings modal when navigate action is from modal
    this.$router.push('/files/browse')
  },
}
</script>
