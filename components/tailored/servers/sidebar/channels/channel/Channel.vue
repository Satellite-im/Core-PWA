<template src="./Channel.html"></template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Channel',
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
