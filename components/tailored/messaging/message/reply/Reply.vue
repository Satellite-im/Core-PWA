<template src="./Reply.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import VueMarkdown from 'vue-markdown'

import { PlusSquareIcon, MinusSquareIcon } from 'satellite-lucide-icons'

import { Message, Group } from '~/types/messaging'

export default Vue.extend({
  components: {
    VueMarkdown,
    PlusSquareIcon,
    MinusSquareIcon,
  },
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
    return { showReplies: false, replyHover: '' }
  },
  computed: {
    /**
     * makeReplyText: generates the "Replies from _____" text in a chat
     * depending on the number of users in the reply thread, it will generate a different replyText
     */
    makeReplyText() {
      const replyLength = Object.keys(this.$props.message.replies).length
      let baseReply = replyLength > 1 ? 'Replies from ' : 'Reply from '

      const firstName = this.$mock.users.filter(
        (u: any) => u.address === this.$props.message.replies[0].from
      )[0].name
      const secondName =
        replyLength > 1
          ? this.$mock.users.filter(
              (u: any) => u.address === this.$props.message.replies[1].from
            )[0].name
          : ''

      if (replyLength === 1) {
        baseReply += firstName
      } else if (replyLength === 2) {
        baseReply += firstName + ' and ' + secondName
      } else {
        baseReply +=
          firstName +
          ', ' +
          secondName +
          ', and ' +
          (replyLength - 2) +
          ' more ...'
      }
      return baseReply
    },
  },
  methods: {
    mouseOver(replyId: string) {
      this.$data.replyHover = replyId
    },

    emojiReaction(replyID: string) {
      this.$store.commit('settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
        replyID,
      })
      this.$store.commit('toggleEnhancers', true)
    },
    showQuickProfile(e: Event) {
      this.$store.commit('setQuickProfilePosition', e)
      this.$store.commit('quickProfile', true)
    },
    toggleReplies() {
      this.$data.showReplies = !this.$data.showReplies
    },
  },
})
</script>
<style lang="less" src="./Reply.less"></style>
