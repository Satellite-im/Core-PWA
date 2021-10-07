<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

// @ts-ignore
import { TerminalIcon, GridIcon, ArrowRightIcon } from 'vue-feather-icons'

import FileUpload from '../fileupload/FileUpload.vue'
import {
  containsCommand,
  parseCommand,
  commands,
  isArgsValid,
} from '~/libraries/ui/Commands'
import {
  htmlToMarkdown,
  markDownToHtml,
  getCaretPosition,
  setCaretPosition,
} from '~/libraries/ui/Chatbar'

declare module 'vue/types/vue' {
  interface Vue {
    autoGrow: Function
    sendMessage: Function
    handleInputChange: Function
    value: string
  }
}

export default Vue.extend({
  components: {
    FileUpload,
    TerminalIcon,
    GridIcon,
    ArrowRightIcon,
  },
  data() {
    return {
      text: '',
      maxChars: 256,
      showEmojiPicker: false,
    }
  },
  computed: {
    ...mapState(['ui']),
    charlimit() {
      return this.$data.text.length > this.$data.maxChars
    },
    hasCommand() {
      return (
        containsCommand(this.ui.chatbarContent) &&
        commands.some((cmd) =>
          cmd.name.startsWith(
            parseCommand(this.ui.chatbarContent).name.toLowerCase()
          )
        )
      )
    },
    isValidCommand() {
      const currentText = parseCommand(
        this.ui.chatbarContent
      ).name.toLowerCase()
      const currentArgs = parseCommand(this.ui.chatbarContent).args
      const currentCommand = commands.find((c) => c.name === currentText)

      return currentCommand && isArgsValid(currentCommand, currentArgs)
    },
    value: {
      get() {
        return this.ui.chatbarContent
      },
      set(val: string) {
        this.$store.commit('chatbarContent', val)
        this.$data.text = val
      },
    },
    placeholder() {
      if (this.$data.text === '') {
        return this.$t('global.talk')
      } else {
        return ''
      }
    },
  },
  methods: {
    toggleEnhancers() {
      this.$store.commit('toggleEnhancers', !this.ui.showEnhancers)
    },
    /**
     * When Shift+Enter is pressed, this controls chatbar's height so that user can input multiple lines.
     * This is called after the typed inputed are processed in order to display markdown expression.
     */
    autoGrow() {
      // made const variables from this.$refs --> HTMLElement through typecasting
      const messageBox = this.$refs.messageuser as HTMLElement
      const chatbarGroup = this.$refs.chatbar as HTMLElement
      const wrap = this.$refs.wrap as HTMLElement

      // set default height to be auto, so it will expand as needed but NOT on every input
      messageBox.style.height = 'auto'
      if (this.$data.text.split('\n').length > 1) {
        wrap.classList.add('expanded')
      } else {
        wrap.classList.remove('expanded')
      }
      if (messageBox.scrollHeight < 112) {
        messageBox.style.height = `${messageBox.scrollHeight + 2}px`
        chatbarGroup.style.height = `${messageBox.scrollHeight + 42}px`
      } else {
        messageBox.style.height = '112px'
        chatbarGroup.style.height = '152px'
      }
      messageBox.scrollTop = messageBox.scrollHeight
    },
    /**
     * Called from handleInputKeydown function when normal key events are fired for typing in chatbar.
     * Decodes current HTML content of chatbar to plain text and Encodes plain text to Markdown HTML expression.
     * Once replaced current HTML content, move the caret to proper position.
     */
    handleInputChange(caretPosition: number | null) {
      const messageBox = this.$refs.messageuser as HTMLElement
      if (messageBox.textContent) {
        const markDown = htmlToMarkdown(messageBox.innerHTML)
        this.value = markDown
        if (caretPosition == null) {
          caretPosition = getCaretPosition(messageBox)
        }
        let offset = messageBox.textContent.trim().length
        messageBox.innerHTML = markDownToHtml(markDown)
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
      this.autoGrow()
    },
    /**
     * Called from chatbar's keydown event to process all key events for typing in chatbar.
     * This interacts with handleInputChange in order to convert typed input to markdown expression.
     * This controls the caret position when Backspace, Spacebar is pressed.
     */
    handleInputKeydown(event: KeyboardEvent) {
      const messageBox = this.$refs.messageuser as HTMLElement
      let caretPosition: number | null = null
      switch (event.key) {
        case 'Backspace':
          {
            const parsedCommand = parseCommand(this.value)
            const currentCommand = commands.find(
              (c) => c.name === parsedCommand.name.toLowerCase()
            )
            if (currentCommand && parsedCommand.args.length === 0) {
              messageBox.innerHTML = ''
              this.value = ''
              this.autoGrow()
              return false
            }
            caretPosition = getCaretPosition(messageBox) - 1
          }
          break
        case 'Enter':
          if (!event.shiftKey) {
            event.preventDefault()
            if (this.value !== '' && !this.hasCommand) {
              this.sendMessage()
            } else if (this.hasCommand && !this.isValidCommand) {
              console.log('dispatch command')
            }
          } else {
            this.autoGrow()
          }
          return true
        case 'Spacebar':
        case ' ':
          {
            event.preventDefault()
            const caretPosition = getCaretPosition(messageBox)
            setTimeout(() => {
              setCaretPosition(messageBox, caretPosition + 1)
              messageBox.focus()
            }, 10)
          }
          return true
        case 'Left':
        case 'ArrowLeft':
        case 'Right':
        case 'ArrowRight':
        case 'End':
        case 'Shift':
          return true
        case 'a':
        case 'A':
          if (event.ctrlKey) {
            return true
          }
          break
      }
      setTimeout(() => {
        this.handleInputChange(caretPosition)
      }, 10)
      return true
    },
    /**
     * Called when user sends message by pressing Enter.
     */
    sendMessage() {
      this.$store.dispatch('sendMessage', {
        value: this.value,
        user: this.$mock.user,
        isOwner: true,
      })
      const messageBox = this.$refs.messageuser as HTMLElement
      messageBox.innerHTML = ''
      this.value = ''
      this.$nextTick(() => {
        this.autoGrow()
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>

<style lang="less">
.messageuser p {
  font-size: @text-size !important;
}
</style>
