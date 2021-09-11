<template src="./Channels.html"></template>

<script lang="ts">
import Vue from 'vue'

import { Channel } from '~/types/ui/server'

export default Vue.extend({
  methods: {
    setActiveChannel (channel: Channel) {
      const nonText = ['voice', 'label']
      if (!nonText.includes(channel.type)) {
        this.$store.commit('setActiveChannel', channel)
      } else {
        // TODO: Join voice channel
      }
    }
  },
  mounted () {
    if (!this.$store.state.channel) {
      this.$store.commit('setActiveChannel', this.$mock.server.info.channels['0'])
    }
  }
})
</script>

<style scoped lang="less" src="./Channels.less"></style>
