<template src="./Actions.html"></template>
<script lang="ts">
import Vue from 'vue'

import {
  SmileIcon,
  CornerDownRightIcon,
  ArchiveIcon,
  MoreVerticalIcon,
  // @ts-ignore
} from 'vue-feather-icons'
import { mapState } from 'vuex'

export default Vue.extend({
  components: {
    SmileIcon,
    CornerDownRightIcon,
    ArchiveIcon,
    MoreVerticalIcon,
  },
  props: {
    setReplyChatbarContent: {
      type: Function,
      default: () => () => {},
    },
    emojiReaction: {
      type: Function,
      default: () => () => {},
    },
    hideReply: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    ...mapState(['ui']),
  },
})
</script>
<style lang="less" scoped src="./Actions.less"></style>
