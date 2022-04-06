<template src="./Reply.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { PlusSquareIcon, MinusSquareIcon } from 'satellite-lucide-icons'
import { UIMessage, Group, UIReply } from '~/types/messaging'
import { getUsernameFromState } from '~/utilities/Messaging'
import { toHTML } from '~/libraries/ui/Markdown'
import { ReplyMessage } from '~/types/textile/mailbox'

export default Vue.extend({
  components: {
    PlusSquareIcon,
    MinusSquareIcon,
  },
  props: {
    message: {
      type: Object as PropType<UIMessage>,
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
    from: {
      type: String,
      default: '',
    },
  },
  data() {
    return { showReplies: false, replyHover: '', chosenReply: {} }
  },
  computed: {
    ...mapState(['chat', 'ui', 'accounts']),
    setChatReply: {
      set(state) {
        this.$store.commit('chat/setChatReply', state)
      },
      get() {
        return this.chat.replies
      },
    },
    /**
     * makeReplyText: generates the "Replies from _____" text in a chat
     * depending on the number of users in the reply thread, it will generate a different replyText
     */
    makeReplyText() {
      const replyLength = Object.keys(this.$props.message.replies).length
      const baseReply = replyLength > 1 ? 'Replies from ' : 'Reply from '

      const getNamesList = (
        replies: any[],
        limit = 2,
        initialText = '',
        separator = ' and ',
      ) =>
        replies
          .slice(0, limit)
          .reduce(
            (text, reply, i) =>
              text +
              (i > 0 && i < limit ? separator : '') +
              getUsernameFromState(reply.from, this.$store.state),
            initialText,
          )

      const names = getNamesList(this.$props.message.replies, 2, baseReply)

      return replyLength > 2
        ? `${names} and ${replyLength - 2} more ...`
        : names
    },
  },
  mounted() {
    const findItem = this.setChatReply.find(
      (item: any) => item.replyId === this.$props.message.id,
    )

    if (findItem) {
      this.$data.showReplies = findItem.value
    }
  },
  methods: {
    replyEdit(replyID: string) {
      return this.ui.editMessage.id === replyID
    },
    /**
     * @method markdownToHtml
     * @description convert text markdown to html
     * @param str String to convert
     */
    markdownToHtml(text: string) {
      return toHTML(text, { liveTyping: false })
    },
    getUsernameFromReply(reply: any) {
      return getUsernameFromState(reply.from, this.$store.state)
    },
    /**
     * Called when click the "Edit Message" on context menu
     * Commit store mutation in order to notify the edit status
     */
    editMessage(e: MouseEvent, reply: any) {
      const { id, payload, type, from, replyType } = reply
      if (
        replyType === 'text' &&
        from === this.accounts.details.textilePubkey
      ) {
        this.$store.commit('ui/setEditMessage', {
          id,
          payload,
          from: reply.id,
        })
      }
    },
    /**
     * Called from MessageEdit component when complete to edit message
     * Called from MessageEdit component with changed message When save or cancel / Enter or Escape is pressed
     */
    saveMessage(newMessage: string, reply: any) {
      this.$store.commit('ui/setEditMessage', {
        id: '',
        payload: newMessage,
        from: reply.from,
      })
      this.$store.commit('ui/saveEditMessage', {
        id: reply.id,
        payload: newMessage,
        from: reply.from,
      })

      if (reply.payload !== this.$props.message.payload) {
        this.$store.dispatch('textile/editTextMessage', {
          to: reply.to,
          original: reply,
          text: newMessage,
        })
      }
    },
    cancelMessage() {
      this.$store.commit('ui/setEditMessage', {
        id: '',
        payload: '',
        from: this.$props.group.id,
      })

      this.$store.commit('ui/saveEditMessage', {
        id: this.$props.message.id,
        payload: 'message',
        from: this.$props.group.id,
      })
    },
    /**
     * @method mouseOver DocsTODO
     * @description
     * @param replyId
     * @example
     */
    mouseOver(replyId: string) {
      this.$data.replyHover = replyId
    },
    /**
     * @method emojiReaction DocsTODO
     * @description
     * @param replyId
     * @example
     */
    emojiReaction(e: MouseEvent, replyID: string) {
      const myTextilePublicKey = this.$TextileManager.getIdentityPublicKey()
      this.$store.commit('ui/settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: replyID,
        to:
          this.$props.message.to === myTextilePublicKey
            ? this.$props.message.from
            : this.$props.message.to,
      })
      this.$store.commit('ui/toggleEnhancers', {
        show: true,
        floating: !!this.$device.isMobile,
        position: [e.clientX, e.clientY],
        containerWidth: this.$el.clientWidth,
      })
    },
    /**
     * @method setReplyChatbarContent DocsTODO
     * @description
     * @example
     */
    setReplyChatbarContent() {
      const myTextilePublicKey = this.$TextileManager.getIdentityPublicKey()
      const { id, type, payload, to, from } = this.$props.message
      let finalPayload = payload
      if (['image', 'video', 'audio', 'file'].includes(type)) {
        finalPayload = `*${this.$t('conversation.multimedia')}*`
      } else if (type === 'glyph') {
        finalPayload = `<img src=${payload} width='16px' height='16px' />`
      }
      this.$store.commit('ui/setReplyChatbarContent', {
        id,
        payload: finalPayload,
        from: this.$props.from,
        messageID: this.$props.message.id,
        to: to === myTextilePublicKey ? from : to,
      })
      this.$store.dispatch('ui/setChatbarFocus')
    },
    /**
     * @method showQuickProfile DocsTODO
     * @description
     * @param e
     * @example
     */
    showQuickProfile(e: MouseEvent) {
      this.$store.dispatch('ui/showQuickProfile', {
        textilePublicKey: this.$props.message.from,
        position: { x: e.x, y: e.y },
      })
    },
    /**
     * @method toggleReplies DocsTODO
     * @description
     * @example
     */
    toggleReplies() {
      this.$data.showReplies = !this.$data.showReplies

      this.setChatReply = {
        replyId: this.$props.message.id,
        value: this.$data.showReplies,
      }
    },
  },
})
</script>
<style lang="less" src="./Reply.less"></style>
