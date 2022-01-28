<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { TerminalIcon } from 'satellite-lucide-icons'
import Editable from './Editable.vue'
import {
  parseCommand,
  commands,
  isArgsValid,
  hasCommandPreview,
} from '~/libraries/ui/Commands'
import { Friend } from '~/types/ui/friends'
import {
  KeybindingEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { ChatTextObj } from '~/types/chat/chat'

declare module 'vue/types/vue' {
  interface Vue {
    sendMessage: Function
    text: string
    updateText: Function
    handleUpload: Function
    debounceTypingStop: Function
    typingNotifHandler: Function
    smartTypingStart: Function
    clearChatbar: Function
    handleChatBorderRadius: Function
    setChatText: ChatTextObj
  }
}

export default Vue.extend({
  components: {
    TerminalIcon,
    Editable,
  },
  data() {
    return {
      showEmojiPicker: false,
      recipientTyping: false,
      showFilePreview: false,
      nsfwUploadError: false,
    }
  },
  props: {
    recipient: {
      type: Object as PropType<Friend>,
    },
  },
  computed: {
    ...mapState(['ui', 'friends', 'chat']),
    setChatText: {
      set(state) {
        this.$store.commit('chat/setChatText', state)
      },
      get() {
        return this.chat.chatTexts
      },
    },
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
      return currentCommand != null
    },
    /**
     * @method hasCommandPreview DocsTODO
     * @description
     * @returns
     * @example
     */
    commandPreview() {
      return hasCommandPreview(this.ui.chatbarContent)
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
      return currentCommand && isArgsValid(currentCommand, currentArgs)
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
      set(val: string) {
        this.$store.commit('ui/chatbarContent', val)
        this.setChatText = {
          userId: this.$props.recipient?.address,
          value: this.text,
        }
      },
    },
    placeholder() {
      if (!this.hasCommand && this.$data.text === '') {
        return this.$t('ui.talk')
      }
      return ''
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
        const activePeer = this.$WebRTC.getPeer(activeFriend.address)
        activePeer?.send('TYPING_STATE', { state })
      }
    },
    /**
     * @method debounceTypingStop
     * @description Debounces the typing event so that we only send the typing stopped after it's been
     * the configured amount of time since they last triggered a keyup event.
     */
    debounceTypingStop: debounce(function (ctx) {
      ctx.$data.typing = false
      ctx.typingNotifHandler(PropCommonEnum)
    }, 500),
    /**
     * @method smartTypingStart
     * @description Let's us send out events when a user starts typing without spam.
     */
    smartTypingStart() {
      if (this.$data.typing) return
      this.$data.typing = true
      this.typingNotifHandler(PropCommonEnum.TYPING)
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
    handleInputKeyup() {
      this.debounceTypingStop(this)
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
        const isEmpty = RegExp(this.$Config.regex.blankSpace, 'g').test(value)
        if (!this.recipient || isEmpty) {
          return
        }
        if (this.ui.replyChatbarContent.from) {
          this.$store.dispatch('textile/sendReplyMessage', {
            to: this.recipient.textilePubkey,
            text: value,
            replyTo: this.ui.replyChatbarContent.messageID,
            replyType: MessagingTypesEnum.TEXT,
          })
          this.text = ''
          return
        }
        this.$store.dispatch('textile/sendTextMessage', {
          to: this.recipient.textilePubkey,
          text: value,
        })
        this.$data.nsfwUploadError = false
        this.text = ''
      }
    },
    /**
     * @method handleDrop
     * @description Allows the drag and drop of files into the chatbar
     * @param e Drop event data object
     * @example v-on:drop="handleDrop"
     */
    handleDrop(e: DragEvent) {
      if (e.dataTransfer) {
        this.handleUpload(e?.dataTransfer?.items, e)
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
        .filter((f: any) => f.type.includes(MessagingTypesEnum.IMAGE))
        .map((f: any) => f.getAsFile())
      if (arrOfFiles.length) {
        e.preventDefault()
        const handleFileExpectEvent = { target: { files: [...arrOfFiles] } }
        // @ts-ignore
        this.$refs['file-upload']?.handleFile(handleFileExpectEvent)
      }
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
    recipient() {
      let findItem = this.chat.chatTexts.find(
        (item: any) => item.userId === this.$props.recipient?.address,
      )
      let message = findItem ? findItem.value : ''

      this.$store.commit('ui/chatbarContent', message)
      this.$store.commit('ui/setReplyChatbarContent', {
        id: '',
        payload: '',
        from: '',
      })
      this.$store.dispatch('ui/setChatbarFocus', true)
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
