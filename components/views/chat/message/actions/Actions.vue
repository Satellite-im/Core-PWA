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
import { ModalWindows } from '~/store/ui/types'

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
  data() {
    return {
      hasMoreSettings: false,
      featureReadyToShow: false,
    }
  },
  computed: {
    ...mapState(['ui', 'accounts']),
    isEditable(): boolean {
      return (
        this.message.from === this.accounts.details.textilePubkey &&
        !(this.message.type === 'glyph' || this.message.type === 'file')
      )
    },
    ModalWindows: () => ModalWindows,
  },
  methods: {
    toggleModal(modalName: ModalWindows) {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
  },
})
</script>
<style lang="less" scoped src="./Actions.less"></style>
