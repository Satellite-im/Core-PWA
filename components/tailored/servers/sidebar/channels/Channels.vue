<template src="./Channels.html"></template>

<script lang="ts">
import Vue from 'vue'

import { Channel } from '~/types/ui/server'
import { mapState } from 'vuex'

export default Vue.extend({
  methods: {
    /**
     * @method setActiveChannel DocsTODO
     * @description
     * @param ch
     * @example
     */
    setActiveChannel(ch: Channel) {
      const nonText = ['voice', 'label']
      if (!nonText.includes(ch.type)) {
        this.$store.commit('setActiveChannel', ch)
      } else {
        // TODO: Join voice channel
      }
    },
  },
  computed: {
    ...mapState(['channel']),
  },
  mounted() {
    if (!this.channel) {
      this.$store.commit('setActiveChannel', this.$mock.server.info.channels['0'])
    }
  },
})
</script>

<style scoped lang="less" src="./Channels.less"></style>
