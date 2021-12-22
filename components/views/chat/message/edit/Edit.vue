<template src="./Edit.html"></template>

<script lang="ts">
import { number } from 'io-ts'
import Vue from 'vue'

// @ts-ignore
import { SmileIcon } from 'vue-feather-icons'
import { Config } from '~/config'

import {
  htmlToMarkdown,
  markDownToHtml,
  getCaretPosition,
  setCaretPosition,
} from '~/libraries/ui/Chatbar'

export default Vue.extend({
  components: {
    SmileIcon,
  },
  props: {
    message: {
      type: String,
      required: true,
    },
    maxChars: {
      type: Number,
      default: Config.chat.messageMaxChars,
    },
  },
  data() {
    return {
      content: '',
      lengthCount: 0,
    }
  },
  mounted() {
    this.content = this.$props.message
    const messageBox = this.$refs.messageBox as HTMLElement
    messageBox.innerHTML = markDownToHtml(this.content)
    this.lengthCount = messageBox.innerText.trim().length
    setCaretPosition(messageBox, this.content.length)
  },
  methods: {
    saveMessage() {
      this.$emit('commitMessage', this.content)
    },
    cancelMessage() {
      this.$emit('cancelMessage')
    },
    calculateLengthCount() {
      const messageBox = this.$refs.messageBox as HTMLElement
      this.lengthCount = messageBox.textContent
        ? messageBox.textContent.trim().length
        : 0
    },
    /**
     * Called from handleInputKeydown function when normal key events are fired for typing in chatbar.
     * Decodes current HTML content of chatbar to plain text and Encodes plain text to Markdown HTML expression.
     * Once replaced current HTML content, move the caret to proper position.
     */
    handleInputChange() {
      const messageBox = this.$refs.messageBox as HTMLElement
      this.calculateLengthCount()
      if (messageBox && messageBox.textContent) {
        if (this.lengthCount >= this.maxChars) {
          messageBox.innerText = messageBox.innerText.slice(0, this.maxChars)
          setCaretPosition(messageBox, this.maxChars)
          this.calculateLengthCount()
        }
        const markDown = htmlToMarkdown(messageBox.innerHTML)
        this.content = markDown
        let caretPosition = getCaretPosition(messageBox)
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
    },
    /**
     * Called from chatbar's keydown event to process all key events for typing in chatbar.
     * This interacts with handleInputChange in order to convert typed input to markdown expression.
     * This controls the caret position when Backspace, Spacebar is pressed.
     */
    handleInputKeydown(event: KeyboardEvent) {
      const messageBox = this.$refs.messageBox as HTMLElement
      switch (event.key) {
        case 'Backspace':
        case 'Delete':
          this.calculateLengthCount()
          return
        case 'Enter':
          if (!event.shiftKey) {
            this.saveMessage()
          }
          return
        case 'Spacebar':
        case ' ':
          {
            this.calculateLengthCount()
            event.preventDefault()
            const caretPosition = getCaretPosition(messageBox)
            this.$nextTick(() => {
              setCaretPosition(messageBox, caretPosition + 1)
              messageBox.focus()
            })
          }
          return
        case 'Left':
        case 'ArrowLeft':
        case 'Right':
        case 'ArrowRight':
        case 'End':
        case 'Shift':
          return
        case 'Escape':
          this.cancelMessage()
          break
        case 'a':
        case 'A':
          if (event.ctrlKey) {
            return
          }
        default:
          this.calculateLengthCount()
          if (this.lengthCount >= this.maxChars) {
            event.preventDefault()
            event.stopPropagation()
          }
          break
      }
    },
    handleInputKeyup(event: KeyboardEvent) {
      const messageBox = this.$refs.messageBox as HTMLElement
      switch (event.key) {
        case 'Backspace':
        case 'Delete':
          if (messageBox.textContent && messageBox.textContent.trim() === '') {
            messageBox.innerHTML = ''
          }
          break
        case 'a':
        case 'A':
          if (event.ctrlKey) {
            return
          }
          break
        case 'Home':
        case 'End':
        case 'Left':
        case 'ArrowLeft':
        case 'Up':
        case 'ArrowUp':
        case 'Right':
        case 'ArrowRight':
        case 'Down':
        case 'ArrowDown':
          return
        case 'Control':
        case 'Shift':
          return
      }
      this.$nextTick(() => {
        this.handleInputChange()
      })
    },
  },
})
</script>

<style lang="less" src="./Edit.less"></style>
