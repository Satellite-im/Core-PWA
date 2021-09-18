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
  mounted() {
    setTimeout(() => {
      this.$data.loading = false
      this.$store.dispatch('setMessages', this.$mock.messages)
    }, 3000)
    this.$store.dispatch('fetchFriends')
  },
  computed: {
    ...mapState(['media']),
  },
})
</script>

<style lang="less" src="./Group.less"></style>
