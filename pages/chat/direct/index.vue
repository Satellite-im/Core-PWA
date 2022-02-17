<template>
  <div />
</template>
<script>
import Vue from 'vue'
export default {
  mounted() {
    this.$store.commit('ui/toggleSettings', { show: false }) // Hide settings modal when navigate action is from modal

    const { friends } = this.$store.state
    if (friends && friends.all && friends.all.length > 0) {
      this.$router.replace({
        path: `/chat/direct/${friends.all[0].address}`,
      })
    }
  },
}
</script>
