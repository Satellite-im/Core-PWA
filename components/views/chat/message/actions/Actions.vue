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
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    SmileIcon,
    CornerDownRightIcon,
    ArchiveIcon,
    EditIcon,
    MoreVerticalIcon,
  },
  props: {
    setReplyChatbarMessage: {
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
      chat: iridium.chat,
      hasMoreSettings: false,
      featureReadyToShow: false,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      accounts: (state) => (state as RootState).accounts,
    }),
    isEditable(): boolean {
      return (
        this.message.from === this.accounts.details?.textilePubkey &&
        !(this.message.type === 'glyph' || this.message.type === 'file')
      )
    },
    isGroup(): boolean {
      const conversationId = this.$route.params.id
      if (!conversationId) {
        return false
      }
      return this.chat.isGroup(conversationId)
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
