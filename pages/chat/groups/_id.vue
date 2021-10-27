<template src="./Group.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'GroupMessages',
  layout: 'chat',
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    ...mapState(['media']),
  },
  mounted() {
    setTimeout(() => {
      this.$data.loading = false
      this.$store.dispatch('ui/setMessages', this.$mock.messages)
    }, 3000)
    this.$store.dispatch('friends/fetchFriends')
  },
})
</script>

<style lang="less" src="./Group.less"></style>
