<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import { TerminalIcon } from 'satellite-lucide-icons'

import FileUpload from '../fileupload/FileUpload.vue'
import {
  commandPrefix,
  // containsCommand,
  parseCommand,
  commands,
  isArgsValid,
} from '~/libraries/ui/Commands'
import {
  htmlToMarkdownInchatbar,
  markDownToHtmlInchatbar,
  getCaretPosition,
  setCaretPosition,
} from '~/libraries/ui/Chatbar'
import { Friend } from '~/types/ui/friends'

declare module 'vue/types/vue' {
  interface Vue {
    sendMessage: Function
    handleInputChange: Function
    value: string
    updateText: Function
  }
}

export default Vue.extend({
  components: {
    FileUpload,
    TerminalIcon,
  },
  data() {
    return {
      text: '',
      showEmojiPicker: false,
      maxChars: 256,
    }
  },
  props: {
    recipient: {
      type: Object as PropType<Friend>,
    },
  },
  computed: {
    ...mapState(['ui']),
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
      return this.$data.text.length > this.$data.maxChars
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
        (cmd) => cmd.name === parsedCommand.name.toLowerCase()
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
        this.ui.chatbarContent
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
        return this.$t('global.talk')
      } else {
        return ''
      }
    },
  },
  methods: {
    /**
     * @method handleInputChange DocsTODO
     * @description Called from handleInputKeydown function when normal key events are fired for typing in chatbar.
     * Decodes current HTML content of chatbar to plain text and Encodes plain text to Markdown HTML expression.
     * Once replaced current HTML content, move the caret to proper position.
     * @param key Keydown event String
     * @example
     */
    handleInputChange(key: any) {
      const messageBox = this.$refs.messageuser as HTMLElement
      if (messageBox.textContent) {
        const markDown = htmlToMarkdownInchatbar(messageBox.textContent, key)
        this.value = markDown
        let caretPosition = getCaretPosition(messageBox)
        let offset = messageBox.textContent.trim().length
        let html = markDownToHtmlInchatbar(markDown)

        const parsedCommand = parseCommand(this.value)
        const currentCommand = commands.find(
          (c) => c.name === parsedCommand.name.toLowerCase()
        )
        if (
          currentCommand &&
          currentCommand.args.length > 0 &&
          parsedCommand.args.length > 0 &&
          currentCommand.args[0].name === parsedCommand.args[0]
        ) {
          html = html.replace(
            parsedCommand.args[0] as string,
            "<span class='chatbar-tag'>" + parsedCommand.args[0] + '</span>'
          )
        }

        messageBox.innerHTML = html
        if (offset >= messageBox.textContent.trim().length + 2) {
          offset -= messageBox.textContent.trim().length
          caretPosition -= offset
          if (messageBox.innerHTML.includes('blockquote')) {
            caretPosition += 1
          }
        } else if (
          offset < messageBox.textContent.trim().length &&
          caretPosition === offset
        ) {
          offset = messageBox.textContent.trim().length - offset
          caretPosition += offset
        }
        setCaretPosition(messageBox, caretPosition)
        messageBox.focus()
      }
      const wrap = this.$refs.wrap as HTMLElement
      // Delete extra character when it exceeds the charlimit
      if (
        messageBox.innerHTML &&
        messageBox.innerHTML.length > this.$data.maxChars + 1
      ) {
        messageBox.innerHTML = messageBox.innerHTML.slice(0, -1)
        this.updateText()
      }
      if (wrap.offsetHeight > 50) wrap.style.borderRadius = '4px'
      if (wrap.offsetHeight < 50) wrap.style.borderRadius = '41px'
      this.value = messageBox.innerHTML
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
      const messageBox = this.$refs.messageuser as HTMLElement
      switch (event.key) {
        case 'Backspace':
          this.$nextTick(() => {
            if (messageBox.textContent) {
              const parsedCommand = parseCommand(messageBox.textContent)
              const currentCommand = commands.find(
                (c) => c.name === parsedCommand.name.toLowerCase()
              )
              if (
                currentCommand &&
                currentCommand.args.length > 0 &&
                parsedCommand.args.length === 1 &&
                currentCommand.args[0].name === parsedCommand.args[0]
              ) {
                const text = commandPrefix + currentCommand.name
                messageBox.innerHTML = text
                setCaretPosition(messageBox, text.length)
              }
              this.value = htmlToMarkdownInchatbar(
                messageBox.innerHTML,
                'Backspace'
              )
              this.autoGrow()
            }
          })
          return
        case 'Delete':
          this.autoGrow()
          return
        case 'Enter':
          if (!event.shiftKey) {
            event.preventDefault()
            if (this.$data.text !== '' && !this.hasCommand) {
              this.sendMessage()
              break
            }
          } else if (!this.hasCommand) {
            this.autoGrow()
          } else {
            event.preventDefault()
          }
          return
        case 'Spacebar':
        case ' ':
          {
            event.preventDefault()
            const parsedCommand = parseCommand(this.value)
            const currentCommand = commands.find(
              (c) => c.name === parsedCommand.name.toLowerCase()
            )
            if (
              currentCommand &&
              parsedCommand.args.length === 0 &&
              currentCommand.args.length > 0 &&
              messageBox.textContent
            ) {
              const tag = currentCommand.args[0]
              messageBox.innerHTML = `<p>${messageBox.textContent.trim()}<span>&nbsp;</span><span class='chatbar-tag'>${
                tag.name
              }</span><span>&nbsp;</span></p>`
              this.value = `${commandPrefix}${currentCommand.name} ${tag.name}`
              const caretPosition = messageBox.textContent.length
              setCaretPosition(messageBox, caretPosition)
            } else {
              const caretPosition = getCaretPosition(messageBox)
              if (messageBox.textContent && messageBox.textContent.length > 1) {
                let firstContent = messageBox.textContent.substring(
                  0,
                  caretPosition
                )
                var firstMessage = firstContent.replaceAll(
                  ' ',
                  '<span>&nbsp;</span>'
                )

                let lastContent =
                  messageBox.textContent.substring(caretPosition)
                var lastMessage = lastContent.replaceAll(
                  ' ',
                  '<span>&nbsp;</span>'
                )

                if (lastMessage.length > 2) {
                  messageBox.innerHTML = `<p>${firstMessage}<span>&nbsp;</span>${lastMessage}</p>`
                } else {
                  messageBox.innerHTML = `<p>${firstMessage}<span>&nbsp;</span></p>`
                }
              } else {
                messageBox.innerHTML = `<p><span>&nbsp;</span></p>`
              }

              this.$nextTick(() => {
                setCaretPosition(messageBox, caretPosition + 1)
                messageBox.focus()
              })
            }
          }
          break
        default:
          break
      }
      this.handleInputChange()
    },
    handleInputKeyup(event: KeyboardEvent) {
      this.$nextTick(() => {
        this.handleInputChange(event.key)
      })
    },
    /**
     * @method updateText
     * @description Helper function to update the text inside the chatbox and send the cursor to the end.
     */
    updateText() {
      const messageBox = this.$refs.messageuser as HTMLElement
      messageBox.innerHTML = this.value
      let sel = window.getSelection()
      sel?.selectAllChildren(messageBox)
      sel?.collapseToEnd()
    },
    /**
     * @method sendMessage
     * @description Sends message by calling the sendMessage action with current data and
     * then setting all related feilds to their default (empty)
     * @example v-on:click="sendMessage"
     */
    sendMessage() {
      if (!this.recipient) {
        return
      }

      if (this.ui.replyChatbarContent.from) {
        this.$store.dispatch('textile/sendReplyMessage', {
          to: this.recipient.textilePubkey,
          text: this.value,
          replyTo: this.ui.replyChatbarContent.messageID,
        })
      } else {
        this.$store.dispatch('textile/sendTextMessage', {
          to: this.recipient.textilePubkey,
          text: this.value,
        })
      }

      const messageBox = this.$refs.messageuser as HTMLElement
      // Clear Chatbar
      messageBox.innerHTML = ''
      this.value = ''
    },
    /**
     * @method handleDrop
     * @description Allows the drag and drop of files into the chatbar to auto open
     * the file uploader
     */
    handleDrop(e: any) {
      e.preventDefault()
      const file = e.dataTransfer.items[0].getAsFile()
      const handleFileExpectEvent = { target: { files: [file] } }
      // @ts-ignore
      this.$refs['file-upload']?.handleFile(handleFileExpectEvent)
    },
  },
  watch: {
    '$store.state.ui.chatbarContent': function() {
      this.updateText()
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
      border-radius: @corner-rounding;
      background-color: @dark-gray;
      padding: @xlight-spacing;
    }
  }
}
</style>
