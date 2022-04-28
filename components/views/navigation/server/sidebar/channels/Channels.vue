<template src="./Channels.html"></template>

<script lang="ts">
import Vue from 'vue'

import { mapState } from 'vuex'
import { Channel } from '~/types/ui/server'

export default Vue.extend({
  computed: {
    ...mapState(['channel']),
  },
  mounted() {
    if (!this.channel) {
      this.$store.commit(
        'ui/setActiveChannel',
        this.$mock.server.info.channels['0'],
      )
    }
  },
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
        this.$store.commit('ui/setActiveChannel', ch)
      } else {
        // TODO: Join voice channel - AP-391
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Channels.less"></style>
