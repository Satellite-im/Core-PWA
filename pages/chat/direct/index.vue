<template src="./Direct.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DirectMessages',
  layout: 'chat',
  watchQuery: ['group'],
  asyncData({ query, store }) {
    store.dispatch('setSelectedGroup', query.group)
  },
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    setTimeout(() => {
      this.$data.loading = false
      this.$store.dispatch('setMessages', this.$mock.messages)
    }, 3000)
    this.$store.dispatch('fetchFriends')
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
