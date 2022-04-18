<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { throttle } from 'lodash'
import { TerminalIcon } from 'satellite-lucide-icons'
import PeerId from 'peer-id'

import { parseCommand, commands } from '~/libraries/ui/Commands'
import { Friend } from '~/types/ui/friends'
import {
  KeybindingEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { Peer2Peer } from '~/libraries/WebRTC/Libp2p'

declare module 'vue/types/vue' {
  interface Vue {
    sendMessage: Function
    text: string
    updateText: Function
    handleUpload: Function
    throttleTyping: Function
    typingNotifHandler: Function
    smartTypingStart: Function
    clearChatbar: Function
    handleChatBorderRadius: Function
  }
}

export default Vue.extend({
  components: {
    TerminalIcon,
  },
  props: {
    recipient: {
      type: Object as PropType<Friend>,
      default: () => {},
    },
  },
  data() {
    return {
      showEmojiPicker: false,
      recipientTyping: false,
      showFilePreview: false,
      nsfwUploadError: false,
    }
  },
  computed: {
    ...mapState(['ui', 'friends', 'webrtc', 'chat', 'textile']),
    activeFriend() {
      return this.$Hounddog.getActiveFriend(this.friends)
    },
    /**
     * Computes the amount of characters left
     */
    /**
     * @method charlimit DocsTODO
     * @description Checks if current text is longer than the max character limit
     * @returns Boolean based on if the current text length is longer than the max character limit
     * @example
     */
    charlimit() {
      return this.text.length > this.$Config.chat.maxChars
    },
    /**
     * @method hasCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    hasCommand() {
      const parsedCommand = parseCommand(this.ui.chatbarContent)
      const currentCommand = commands.find(
        (cmd) => cmd.name === parsedCommand.name.toLowerCase(),
      )
      // Hide commands for early access
      // return currentCommand != null
      return false
    },
    /**
     * @method hasCommandPreview DocsTODO
     * @description
     * @returns
     * @example
     */
    commandPreview() {
      // Hide commands for early access
      // return hasCommandPreview(this.ui.chatbarContent)
      return false
    },
    /**
     * @method isValidCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    isValidCommand() {
      const currentText = parseCommand(
        this.ui.chatbarContent,
      ).name.toLowerCase()
      const currentArgs = parseCommand(this.ui.chatbarContent).args
      const currentCommand = commands.find((c) => c.name === currentText)
      // Hide commands for early access
      // return currentCommand && isArgsValid(currentCommand, currentArgs)
      return false
    },
    text: {
      /**
       * @method get
       * @description Gets chatbars current text
       * @returns String of chatbars current text
       * @example const currText = this.get()
       */
      get() {
        return this.ui.chatbarContent
      },
      /**
       * @method set
       * @description Sets current chatbar text to new value
       * @param val Value to set the chatbar content to
       * @example set('This is the new chatbar content')
       */
      set(value: string) {
        this.$store.dispatch('ui/setChatbarContent', {
          content: value,
          userId: this.$props.recipient?.address,
        })
      },
    },
    placeholder() {
      if (!this.hasCommand && this.$data.text === '') {
        return this.$t('ui.talk')
      }
      return ''
    },
  },
  watch: {
    'friends.all': {
      handler() {
        const activeFriend = this.$Hounddog.getActiveFriend(this.friends)

        if (activeFriend)
          this.$data.recipientTyping =
            activeFriend.typingState === PropCommonEnum.TYPING
      },
      deep: true,
    },
    'recipient.address': {
      handler() {
        const findItem = this.chat.chatTexts.find(
          (item: any) => item.userId === this.$props.recipient?.address,
        )
        const message = findItem ? findItem.value : ''

        this.$refs.editable?.resetHistory()
        this.$store.commit('ui/setReplyChatbarContent', {
          id: '',
          payload: '',
          from: '',
        })
        this.$store.dispatch('ui/setChatbarContent', { content: message })

        // in desktop, stay chatbar focused when switching recipient
        if (this.$device.isDesktop) {
          this.$store.dispatch('ui/setChatbarFocus')
        }
      },
    },
  },
  methods: {
    /**
     * @method typingNotifHandler
     * @description Wraps the event handler for dispatching typing notifications
     * TODO: Right now this is hard coded to the WebRTC Data method, in the future this should be
     * agnostic and the method should be passed to chatbar so we can support group, and direct messages.
     */
    typingNotifHandler(
      state: PropCommonEnum.TYPING | PropCommonEnum.NOT_TYPING,
    ) {
      const activeFriend = this.$Hounddog.getActiveFriend(this.friends)
      if (activeFriend) {
        try {
          const p2p = Peer2Peer.getInstance()

          if (!activeFriend.peerId) return

          p2p.sendMessage(
            {
              type: 'TYPING_STATE',
              payload: { state: 'TYPING' },
              sentAt: Date.now(),
            },
            PeerId.createFromB58String(activeFriend.peerId),
          )
          // const activePeer = this.$WebRTC.getPeer(activeFriend.address)
          // activePeer?.send('TYPING_STATE', { state })
        } catch (error: any) {
          this.$Logger.log('cannot send after peer is destroyed', 'ERROR', {
            error,
          })
        }
      }
    },
    /**
     * @method throttleTyping
     * @description Throttles the typing event so that we only send the typing once every two seconds
     */
    throttleTyping: throttle(function (ctx) {
      ctx.typingNotifHandler(PropCommonEnum.TYPING)
    }, Config.chat.typingInputThrottle),
    /**
     * @method smartTypingStart
     * @description Let's us send out events when a user starts typing without spam.
     */
    smartTypingStart() {
      this.throttleTyping(this)
    },
    /**
     * @method handleInputKeydown DocsTODO
     * @description Called from chatbar's keydown event to process all key events for typing in chatbar.
     * This interacts with handleInputChange in order to convert typed input to markdown expression.
     * This controls the caret position when Backspace, Spacebar is pressed.
     * @param event Keydown event object
     * @returns Boolean
     * @example
     */
    handleInputKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case KeybindingEnum.ENTER:
          if (!event.shiftKey) {
            event.preventDefault()
            if (!this.hasCommand) {
              return this.sendMessage()
            }
            if (this.hasCommand && !this.isValidCommand) {
              this.$Logger.log('Commands', 'dispatch command')
              return
            }
            return
          }

          // If there is a command disable shift + enter
          if (this.hasCommand) {
            event.preventDefault()
          }
          break
        default:
          break
      }
      this.smartTypingStart()
    },
    /**
     * @method sendMessage
     * @description Sends message by calling the sendMessage action with current data and
     * then setting all related feilds to their default (empty)
     * @example v-on:click="sendMessage"
     */
    async sendMessage() {
      // @ts-ignore
      await this.$refs['file-upload']?.sendMessage()
      if (this.recipient) {
        /* enforce limit as max chars when sending */
        const value =
          this.text.length > this.$Config.chat.maxChars
            ? this.text.slice(0, this.$Config.chat.maxChars)
            : this.text
        this.text = ''
        const isEmpty = value.trim().length === 0
        if (isEmpty) return
        if (!this.recipient || isEmpty) {
          return
        }
        if (
          this.ui.replyChatbarContent.from &&
          !RegExp(this.$Config.regex.uuidv4).test(this.recipient.textilePubkey)
        ) {
          this.$store.dispatch('textile/sendReplyMessage', {
            to: this.recipient.textilePubkey,
            text: value,
            replyTo: this.ui.replyChatbarContent.messageID,
            replyType: MessagingTypesEnum.TEXT,
          })
          return
        }

        // Check if it's a group
        if (
          RegExp(this.$Config.regex.uuidv4).test(
            this.recipient.textilePubkey.split('|')[1],
          )
        ) {
          if (this.ui.replyChatbarContent.from) {
            this.$store.dispatch('textile/sendGroupReplyMessage', {
              to: this.recipient.textilePubkey,
              text: value,
              replyTo: this.ui.replyChatbarContent.messageID,
              replyType: MessagingTypesEnum.TEXT,
            })
            this.text = ''
            return
          }
          this.$store.dispatch('textile/sendGroupMessage', {
            groupId: this.recipient.textilePubkey,
            message: value,
          })
        } else {
          this.$store.dispatch('textile/sendTextMessage', {
            to: this.recipient.textilePubkey,
            text: value,
          })
        }
        this.$data.nsfwUploadError = false
      }
    },
    /**
     * @method handlePaste
     * @description Allows the pasting of files into the chatbar
     * @param e Paste event data object
     * @example v-on:paste="handlePaste"
     */
    handlePaste(e: ClipboardEvent) {
      /* Don't use event.preventDefault(). It prevent original text copy-paste */
      e.stopPropagation()
      /* Upload if image, if not then no action */
      this.handleUpload(e?.clipboardData?.items, e)
    },
    /**
     * @method handleUpload
     * @description Takes in an array of event items and uploads the file objects
     * @param items Array of objects
     * @example this.handleUpload(someEvent.itsData.items)
     */
    handleUpload(items: Array<object>, e: Event) {
      const arrOfFiles: File[] = [...items]
        .filter((f: any) => {
          return f.kind !== MessagingTypesEnum.STRING
        })
        .map((f: any) => f.getAsFile())

      if (arrOfFiles.length) {
        e.preventDefault()
        const handleFileExpectEvent = { target: { files: [...arrOfFiles] } }
        // @ts-ignore
        this.$refs['file-upload']?.handleFile(handleFileExpectEvent)
      }
    },
    handleChatTextFromOutside(text: string) {
      this.$refs.editable?.handleTextFromOutside(text)
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>

<style lang="less">
.messageuser {
  &.editable-container {
    > div {
      padding: 14px 0;
    }
  }
  blockquote {
    border-left: 4px solid @text-muted;
    padding-left: @light-spacing;
  }
  p {
    font-size: @text-size !important;
    .chatbar-tag {
      &:extend(.round-corners);
      background: @midground;
      padding: @xlight-spacing;
    }
  }
}
</style>
