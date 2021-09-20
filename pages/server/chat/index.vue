<template src="./Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

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
      this.$store.dispatch('setMessages', this.$mock.messages)
    }, 3000)
  },
  computed: {
    ...mapState(['ui']),
  },
})
</script>

<style lang="less" src="./Chat.less"></style>
