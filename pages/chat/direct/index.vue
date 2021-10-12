<template src="./Direct.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'DirectMessages',
  layout: 'chat',
  data() {
    return {
      loading: true,
      updateInterval: null,
      testMsgSent: 0,
    }
  },
  mounted() {
    setTimeout(() => {
      this.$data.loading = false
      this.$store.dispatch('setMessages', this.$mock.messages)
      /* Add new message per 5 seconds temporarily */
      this.$data.updateInterval = setInterval(
        this.sendMessageAutomatically,
        5000
      )
    }, 3000)
  },
  beforeDestroy() {
    if (this.$data.updateInterval) {
      clearInterval(this.$data.updateInterval)
      this.updateInterval = null
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method sendMessageAutomatically DocsTODO
     * @description
     * @example
     */
    sendMessageAutomatically() {
      this.$data.testMsgSent += 1
      if (this.$data.testMsgSent > 5) clearInterval(this.$data.updateInterval)
      this.$store.dispatch('sendMessage', {
        value: 'Test Message',
        user: this.$mock.friend,
        isOwner: false,
      })
    },
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
