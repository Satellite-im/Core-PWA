<template src="./Message.html"></template>
<script lang="ts">
// eslint-disable-next-line import/named
import Vue, { PropType } from 'vue'
import VueMarkdown from 'vue-markdown'
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'
import { Message, Group } from '~/types/messaging'

export default Vue.extend({
  components: {
    VueMarkdown,
  },
  mixins: [ContextMenu],
  props: {
    message: {
      type: Object as PropType<Message>,
      default: () => ({
        id: '0',
        at: 1620515543000,
        type: 'text',
        payload: 'Invalid Message',
      }),
    },
    group: {
      type: Object as PropType<Group>,
      default: () => {},
    },
  },
  data() {
    return {
      disData: 'DataFromTheProperty',
      showActions: false,
      contextMenuValues: [
        { text: 'Add Reaction', func: (this as any).testFunc },
        { text: 'Reply', func: (this as any).testFunc },
        { text: 'Copy Message', func: (this as any).testFunc },
        { text: 'Copy Image', func: (this as any).testFunc },
        { text: 'Save Image', func: (this as any).testFunc },
        { text: 'Copy Link', func: (this as any).testFunc },
      ],
    }
  },
  methods: {
    testFunc() {
      console.log('Message Func Testing ' + this.$data.disData)
    },
    toggleActions(toggle: Boolean) {
      if (!this.$store.state.ui.settingReaction.status) {
        this.$data.showActions = toggle
      } else if (
        this.$store.state.ui.settingReaction.messageID ===
        this.$props.message.id
      ) {
        this.$data.showActions = true
      }
    },
    emojiReaction() {
      this.$store.commit('settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
      })
      this.$store.commit('toggleEnhancers', true)
    },
  },
})
</script>
<style lang="less" src="./Message.less"></style>
