<template>
  <UiSimpleScroll
    scroll-mode="vertical"
    scroll-show="scroll"
    container-class="editable-container"
  >
    <div v-if="value.length === 0" class="placeholder">{{ placeholder }}</div>
    <div
      ref="editable"
      :contenteditable="enabled"
      autocapitalize="off"
      class="editable-input"
      data-cy="editable-input"
      @selectstart="onSelectStart"
      @input="onInput"
      @keydown="handleInputKeydown"
      @keyup="handleInputKeyup"
      @paste="handleInputPaste"
      @drop="handleDrop"
      @focus="onFocus"
      @blur="onBlur"
      @click="focusInput"
    >
      <div class="chat-row-content">
        <span><br /></span>
      </div>
    </div>
  </UiSimpleScroll>
</template>

<script lang="ts">
import Vue from 'vue'
import { toHTML } from '~/libraries/ui/Markdown'
import Cursor from '~/libraries/ui/Cursor'
import { KeybindingEnum } from '~/libraries/Enums/enums'
import WithHistory, { Operation } from '~/components/mixins/UI/WithHistory'

function getCurrentRange() {
  const sel = document.getSelection()
  if (sel && sel.rangeCount > 0) {
    return sel.getRangeAt(0)
  }
  return document.createRange()
}

declare module 'vue/types/vue' {
  interface Vue {
    redo: () => void
    undo: () => void
    apply: (op: Operation) => void
  }
}

export default Vue.extend({
  mixins: [WithHistory],
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    focus: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentPosition: 0,
      currentRange: null as Range | null,
    }
  },
  watch: {
    value(newValue) {
      this.handleNewValue(newValue)
    },
    focus(value) {
      if (value) {
        this.focusInput()
      }
    },
    enabled(value) {
      if (value && this.focus) {
        this.focusInput()
      }
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.$nextTick(() => this.$store.dispatch('ui/setChatbarFocus'))
    })
  },
  methods: {
    /**
     * @method focusInput
     * @description focuses the input
     */
    focusInput() {
      this.$nextTick(() => {
        if (!this.$refs?.editable) return
        const messageBox = this.$refs.editable as HTMLElement
        Cursor.setCurrentCursorPosition(this.value.length, messageBox)
      })
    },
    /**
     * @method buildChatbarRow
     * @description builds the chatbar row
     * @param {string} text The text to be parsed
     */
    buildChatbarRow(text: string) {
      return `<div class="chat-row-content"><span>${toHTML(text).replace(
        this.$Config.regex.emojiWrapper,
        (emoji: string) => `<span class="emoji">${emoji}</span>`,
      )}<br /></span></div>`
    },
    /**
     * @method handleNewValue
     * @description Handles the new value
     * @param {string} newValue The new value
     */
    handleNewValue(newValue: string) {
      if (!this.$refs?.editable) return
      const messageBox = this.$refs?.editable as HTMLElement
      const pos = Cursor.getCurrentCursorPosition(messageBox)
      const rows: Array<string> = []
      newValue.split('\n').forEach((row) => {
        // When encountering a newline, create a new row
        row.split('\n').forEach((line) => {
          rows.push(this.buildChatbarRow(line))
        })
      })
      messageBox.innerHTML = rows.join('')
      Cursor.setCurrentCursorPosition(pos, messageBox)
    },
    /**
     * @method handleTextFromOutside
     * @description Handles the text from outside
     * @param text The text to be parsed
     */
    handleTextFromOutside(text: string) {
      const range = this.currentRange
      const sel = document.getSelection()
      if (range) {
        range.deleteContents()
        range.collapse(false)
        sel?.removeAllRanges()
        sel?.addRange(range)
        document.execCommand('insertText', false, text)
        return
      }
      // if a range is not available, insert at the end of the chat
      this.focusInput()
      this.$nextTick(() => {
        document.execCommand('insertText', false, text)
      })
    },
    /**
     * @method handleInputPaste
     * @description Handles the paste event and emits same event to parent
     * @param {ClipboardEvent} e The paste event
     */
    handleInputPaste(e: ClipboardEvent) {
      e.preventDefault()
      const text = e.clipboardData?.getData('text/plain') || ''
      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text)
      } else {
        document.execCommand('paste', false, text)
      }
      this.$emit('paste', e)
    },
    /**
     * @method handleInputKeydown
     * @description Handles the keydown event and emits same event to parent
     * @param {KeyboardEvent} e The keydown event
     */
    handleInputKeydown(e: KeyboardEvent) {
      switch (e.key) {
        case KeybindingEnum.BACKSPACE:
        case KeybindingEnum.DELETE:
          if (
            this.$refs?.editable &&
            (this.$refs?.editable as HTMLElement).innerText === '\n'
          ) {
            e.preventDefault()
          }
          return
        case KeybindingEnum.z:
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (!e.shiftKey) {
              this.undo()
              return
            }

            this.redo()
          }
          return
      }
      this.$emit('keydown', e)
    },
    /**
     * @method handleInputKeyup
     * @description Handles the keyup event and emits same event to parent
     * @param {KeyboardEvent} e The keyup event
     */
    handleInputKeyup(e: KeyboardEvent) {
      this.$emit('keyup', e)
    },
    /**
     * @method handleDrop
     * @description Handles the drag event and emits same event to parent
     * @param {DragEvent} e The drag event
     */
    handleDrop(e: DragEvent) {
      this.$emit('drop', e)
    },
    /**
     * @method onInput
     * @description Handles the input event and emits same event to parent
     * @param {KeyboardEvent} e The input event
     */
    onInput(e: InputEvent) {
      if (e.inputType === 'historyUndo') {
        this.undo()
        return
      }

      if (e.inputType === 'historyRedo') {
        this.redo()
        return
      }

      const messageBox = this.$refs?.editable as HTMLElement
      let finalValue = ''
      messageBox.innerText.split('\n\n').forEach((row, i) => {
        finalValue +=
          i === messageBox.innerText.split('\n\n').length - 1
            ? // Remove the final newline on the last row
              row.replace(/\n$/, '')
            : row + '\n' // Close the row
      })

      const currentText = this.$props.value
      this.apply({
        type:
          currentText.length > finalValue.length
            ? 'remove_text'
            : 'insert_text',
        text: currentText,
        insertedText: e.data ?? '',
        position: this.currentPosition,
        timestamp: this.$dayjs(),
      })

      this.$emit('input', finalValue)
    },
    /**
     * @method onSelectStart
     * @description Prevents the selection of text if there is only a newline
     * @param {Event} e The selectstart event
     */
    onSelectStart(e: Event) {
      const messageBox = this.$refs?.editable as HTMLElement
      this.currentPosition = Cursor.getCurrentCursorPosition(messageBox)
      if (messageBox.innerText === '\n') {
        // If the content is just a newline don't select, this will prevent inner html to be deleted from the contenteditable
        e.preventDefault()
        // This is needed in order to correctly place the cursor on click
        Cursor.setCurrentCursorPosition(0, messageBox)
      }
    },
    /**
     * @method onSelectionChange
     * @description Handles the selectionchange event
     */
    onSelectionChange() {
      const messageBox = this.$refs?.editable as HTMLElement
      this.currentPosition = Cursor.getCurrentCursorPosition(messageBox)
      this.currentRange = getCurrentRange()
    },
    /**
     * @method onFocus
     * @description Handles the focus event and emits same event to parent
     * @param {Event} e The focus event
     */
    onFocus(e: Event) {
      document.addEventListener('selectionchange', this.onSelectionChange)
      this.$emit('focus', e)
    },
    /**
     * @method onBlur
     * @description Handles the blur event and emits same event to parent
     * @param {Event} e The blur event
     */
    onBlur(e: Event) {
      document.removeEventListener('selectionchange', this.onSelectionChange)
      this.$emit('blur', e)
    },
  },
})
</script>
<style lang="less">
// non-Retina-specific stuff here
@media not screen and (-webkit-min-device-pixel-ratio: 2),
  not screen and (min--moz-device-pixel-ratio: 2),
  not screen and (-o-min-device-pixel-ratio: 2/1),
  not screen and (min-device-pixel-ratio: 2),
  not screen and (min-resolution: 192dpi),
  not screen and (min-resolution: 2dppx) {
  .editable-container {
    .chat-row-content {
      // Chrome bug for emoji spacing on non-retina screens
      .emoji {
        letter-spacing: 4px;
      }
    }
  }
}
.editable-container {
  position: relative;
  width: 100%;
  font-size: @mini-text-size;
  font-family: @secondary-font;

  .placeholder {
    color: @text-muted;
    position: absolute;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    left: 0;
    right: 0;
    &:extend(.background-layer);
    &:extend(.no-select);
  }
  .editable-input {
    width: 100%;
    display: inline-block;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: break-spaces !important;
    .chat-row-content {
      padding-right: 5px;
      .emoji {
        font-style: initial;
      }
      .md-symbol {
        color: @gray;
      }
      .md-lang {
        color: @green;
      }
    }
  }
}
</style>
