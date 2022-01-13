<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { TerminalIcon } from 'satellite-lucide-icons'
import { parseCommand, commands, isArgsValid } from '~/libraries/ui/Commands'
import { Friend } from '~/types/ui/friends'
import {
  KeybindingEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { Config } from '~/config'

declare module 'vue/types/vue' {
  interface Vue {
    sendMessage: Function
    handleInputChange: Function
    value: string
    updateText: Function
    handleUpload: Function
    debounceTypingStop: Function
    typingNotifHandler: Function
    smartTypingStart: Function
    handleChatBorderRadius: Function
    clearChatbar: Function
    setChatText: any
    findDiff: Function
    checkEmoji: Function
  }
}
export default Vue.extend({
  components: {
    TerminalIcon,
  },
  data() {
    return {
      text: '',
      showEmojiPicker: false,
      maxChars: Config.chat.messageMaxChars,
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
  directives: {
    focus: {
      update(el, { value, oldValue }) {
        if (value.id !== oldValue.id) {
          el.focus()
        }
      },
    },
  },
  mounted() {
    let findItem = this.setChatText.find(
      (item: any) => item.userId === this.$props.recipient.address,
    )
    let message = findItem ? findItem.value : ''

    const messageBox = this.$refs.messageuser as HTMLElement
    messageBox.innerText = message
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
      return this.$Hounddog.getActiveFriend(this.$store.state.friends)
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
      return this.$data.text.length > this.$Config.chat.maxChars
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
    value: {
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
        this.$data.text = val
      },
    },
    placeholder() {
      if (!this.hasCommand && this.$data.text === '') {
        return this.$t('ui.talk')
      } else {
        return ''
      }
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
      const activeFriend = this.$Hounddog.getActiveFriend(
        this.$store.state.friends,
      )
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
     * @method handleInputChange DocsTODO
     * @description Called from handleInputKeydown function when normal key events are fired for typing in chatbar.
     * Decodes current HTML content of chatbar to plain text and Encodes plain text to Markdown HTML expression.
     * Once replaced current HTML content, move the caret to proper position.
     * @example
     */
    handleInputChange() {
      const messageBox = this.$refs.messageuser as HTMLElement
      // Delete extra character when it exceeds the charlimit
      if (
        messageBox.innerText &&
        messageBox.innerText.length > this.$Config.chat.maxChars + 1
      ) {
        /* remove updateText() here because when this.value is changed it is automatically called */
        messageBox.innerText = messageBox.innerText.slice(0, -1)
      }
      this.value = messageBox.innerText
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
              this.sendMessage()
              break
            }
            if (this.hasCommand && !this.isValidCommand) {
              this.$Logger.log('Commands', 'dispatch command')
              break
            }
          }
          break
        default:
          break
      }
      this.smartTypingStart()
      this.handleInputChange()
    },
    handleInputKeyup() {
      this.debounceTypingStop(this)
      this.$nextTick(() => {
        this.handleInputChange()
      })
    },
    /**
     * @method updateText
     * @description Helper function to update the setChatText and send the cursor to the end if collapseToEnd is true.
     */
    updateText(collapseToEnd: boolean) {
      const messageBox = this.$refs.messageuser as HTMLElement
      if (collapseToEnd) {
        let sel = window.getSelection()
        sel?.selectAllChildren(messageBox)
        sel?.collapseToEnd()
      }
      this.setChatText = {
        userId: this.$props.recipient.address,
        value: messageBox.innerHTML,
      }
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
        const isEmpty = RegExp(this.$Config.regex.blankSpace, 'g').test(
          this.value,
        )
        if (!this.recipient || isEmpty) {
          return
        }
        if (this.ui.replyChatbarContent.from) {
          this.$store.dispatch('textile/sendReplyMessage', {
            to: this.recipient.textilePubkey,
            text: this.value,
            replyTo: this.ui.replyChatbarContent.messageID,
            replyType: MessagingTypesEnum.TEXT,
          })
          this.clearChatbar()
          return
        }
        this.$store.dispatch('textile/sendTextMessage', {
          to: this.recipient.textilePubkey,
          text: this.value,
        })
        this.$data.nsfwUploadError = false
        const messageBox = this.$refs.messageuser as HTMLElement
        this.clearChatbar()
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
    clearChatbar() {
      const messageBox = this.$refs.messageuser as HTMLElement
      messageBox.innerHTML = ''
      this.value = ''
    },
    findDiff(str1: string, str2: string) {
      let i = 0
      let j = 0
      let result = ''

      while (j < str2.length) {
        if (str1[i] != str2[j] || i == str1.length) result += str2[j]
        else i++
        j++
      }
      return result
    },
    checkEmoji(str: string) {
      var regex =
        /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
      return str.match(regex)?.length ? true : false
    },
  },
  watch: {
    'ui.chatbarContent': {
      handler(newValue, oldValue) {
        const messageBox = this.$refs.messageuser as HTMLElement

        this.checkEmoji(this.findDiff(oldValue, newValue))
          ? (messageBox.innerHTML = this.ui.chatbarContent)
          : this.updateText(false)
      },
      deep: true,
    },
    'friends.all': {
      handler() {
        const activeFriend = this.$Hounddog.getActiveFriend(
          this.$store.state.friends,
        )
        if (activeFriend)
          this.$data.recipientTyping =
            activeFriend.typingState === PropCommonEnum.TYPING
      },
      deep: true,
    },
    recipient: function () {
      let findItem = this.setChatText.find(
        (item: any) => item.userId === this.$props.recipient.address,
      )
      let message = findItem ? findItem.value : ''

      this.$store.commit('ui/chatbarContent', message)
      this.$store.commit('ui/setReplyChatbarContent', {
        id: '',
        payload: '',
        from: '',
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>

<style lang="less">
.messageuser {
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
