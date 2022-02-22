<template src="./Actions.html" />
<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  SmileIcon,
  CornerDownRightIcon,
  ArchiveIcon,
  EditIcon,
  MoreVerticalIcon,
} from 'satellite-lucide-icons'
import { mapState } from 'vuex'
import { UIMessage } from '~/types/messaging'

export default Vue.extend({
  components: {
    SmileIcon,
    CornerDownRightIcon,
    ArchiveIcon,
    EditIcon,
    MoreVerticalIcon,
  },
  data() {
    return {
      hasMoreSettings: false,
      featureReadyToShow: false,
    }
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
    message: {
      type: Object as PropType<UIMessage>,
      default: () => ({
        id: '0',
        at: 1620515543000,
        type: 'text',
        from: 'group',
        payload: 'Invalid Message',
      }),
    },
  },
  computed: {
    ...mapState(['ui', 'accounts']),
    isEditable(): boolean {
      return (
        this.message.from === this.accounts.details.textilePubkey &&
        !(this.message.type === 'glyph' || this.message.type === 'file')
      )
    },
  },
})
</script>
<style lang="less" scoped src="./Actions.less"></style>
