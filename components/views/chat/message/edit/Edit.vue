<template src="./Edit.html"></template>

<script lang="ts">
import Vue from 'vue'

// @ts-ignore
import { SmileIcon } from 'vue-feather-icons'

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
  },
  data() {
    return {
      content: '',
    }
  },
  mounted() {
    this.content = this.$props.message
    const messageBox = this.$refs.messageBox as HTMLElement
    messageBox.innerHTML = markDownToHtml(this.content)
    setCaretPosition(messageBox, this.content.length)
  },
  methods: {
    saveMessage() {
      this.$emit('commitMessage', this.content)
    },
    cancelMessage() {
      this.$emit('cancelMessage')
    },
    /**
     * Called from handleInputKeydown function when normal key events are fired for typing in chatbar.
     * Decodes current HTML content of chatbar to plain text and Encodes plain text to Markdown HTML expression.
     * Once replaced current HTML content, move the caret to proper position.
     */
    handleInputChange() {
      const messageBox = this.$refs.messageBox as HTMLElement
      if (messageBox && messageBox.textContent) {
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
          return
        case 'Enter':
          if (!event.shiftKey) {
            this.saveMessage()
          }
          return
        case 'Spacebar':
        case ' ':
          {
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
        case 'a':
        case 'A':
          if (event.ctrlKey) {
            return
          }
          break
        case 'Escape':
          this.cancelMessage()
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
      }
      this.$nextTick(() => {
        this.handleInputChange()
      })
    },
  },
})
</script>

<style lang="less" src="./Edit.less"></style>
<style lang="less">
.edit-message-body-input {
  blockquote {
    border-left: 4px solid @text-muted;
    padding-left: @light-spacing;
  }
  &:extend(.round-corners);
  p {
    font-size: @text-size !important;
  }
}
</style>
