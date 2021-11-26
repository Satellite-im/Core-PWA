<template src="./Actions.html" />
<script lang="ts">
import Vue from 'vue'

import {
  SmileIcon,
  CornerDownRightIcon,
  ArchiveIcon,
  EditIcon,
  MoreVerticalIcon,
} from 'satellite-lucide-icons'
import { mapState } from 'vuex'

export default Vue.extend({
  components: {
    SmileIcon,
    CornerDownRightIcon,
    ArchiveIcon,
    EditIcon,
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
    editMessage: {
      type: Function,
      default: () => () => {},
    },
    messageOwner: {
      type: String,
      required: true,
    },
    message: {
      type: Object as PropType<UIMessage>,
      default: {
        id: '0',
        at: 1620515543000,
        type: 'text',
        payload: 'Invalid Message',
      }
    }
  },
  computed: {
    ...mapState(['ui', 'accounts']),
  },
})
</script>
<style lang="less" scoped src="./Actions.less"></style>
