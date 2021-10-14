<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  TerminalIcon,
  GridIcon,
  ArrowRightIcon,
  BanknoteIcon,
} from 'satellite-lucide-icons'

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
    BanknoteIcon,
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
      return (
        containsCommand(this.ui.chatbarContent) &&
        commands.some((cmd) =>
          cmd.name.startsWith(
            parseCommand(this.ui.chatbarContent).name.toLowerCase()
          )
        )
      )
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
    /**
     * @method toggleEnhancers
     * @description Toggles enhancers by commiting the opposite of it's current value (this.ui.enhancers.show) to toggleEnhancers in state
     * @example v-on:click="toggleEnhancers"
     */
    toggleEnhancers() {
      this.$store.commit('toggleEnhancers', { show: !this.ui.enhancers.show })
    },
    /**
     * @method autoGrow DocsTODO
     * @description When textarea for chat is changed, autoGrow handles chat section to grow and allow multi-line display
     * @example
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
     * @method handleInputChange DocsTODO
     * @description Called from handleInputKeydown function when normal key events are fired for typing in chatbar.
     * Decodes current HTML content of chatbar to plain text and Encodes plain text to Markdown HTML expression.
     * Once replaced current HTML content, move the caret to proper position.
     * @example
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
     * @method sendMessage
     * @description Sends message by calling the sendMessage action with current data and
     * then setting all related feilds to their default (empty)
     * @example v-on:click="sendMessage"
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
