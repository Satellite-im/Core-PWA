<template src="./Channel.html"></template>

<script>
import { mapState } from 'vuex'

import { HashIcon, TagIcon, RssIcon, Volume2Icon } from 'satellite-lucide-icons'

export default {
  name: 'Channel',
  components: {
    HashIcon,
    TagIcon,
    RssIcon,
    Volume2Icon,
  },
  props: ['localChannel', 'setActiveChannel'],
  computed: {
    ...mapState(['channel']),
  },
  methods: {
    /**
     * @method getChannelClass DocsTODO
     * @description
     * @returns
     * @example
     */
    getChannelClass() {
      return this.channel && this.channel.id === this.localChannel.id
        ? 'active'
        : ''
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Channel.less"></style>
