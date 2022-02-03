<template>
  <UiScroll
    vertical-scroll
    scrollbar-visibility="scroll"
    class="editable-container"
  >
    <div v-if="value.length === 0" class="placeholder">{{ placeholder }}</div>
    <div
      ref="editable"
      :contenteditable="enabled"
      autocapitalize="off"
      class="editable-input"
      @input="onInput"
      @keydown="handleInputKeydown"
      @keyup="handleInputKeyupProps"
      @paste="handleInputPaste"
      @drop="handleDropProps"
    >
      <div class="chat-row-content">
        <span><br /></span>
      </div>
    </div>
  </UiScroll>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { toHTML } from '~/libraries/ui/Markdown'
import Cursor from '~/libraries/ui/Cursor'

export default Vue.extend({
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
    handleInputKeydownProps: {
      type: Function as PropType<(e: KeyboardEvent) => void>,
      default: () => () => {},
    },
    handleInputKeyupProps: {
      type: Function as PropType<(e: KeyboardEvent) => void>,
      default: () => () => {},
    },
    handleDropProps: {
      type: Function as PropType<(e: DragEvent) => void>,
      default: () => () => {},
    },
    handlePasteProps: {
      type: Function as PropType<(e: ClipboardEvent) => void>,
      default: () => () => {},
    },
  },
  computed: {
    ...mapState(['ui']),
  },
  watch: {
    value(newValue) {
      this.handleNewValue(newValue)
    },
    'ui.chatbarFocus': {
      handler(value) {
        if (value) {
          this.$store.dispatch('ui/setChatbarFocus', false)
          if (!this.$refs?.editable) return
          const messageBox = this.$refs?.editable as HTMLElement
          Cursor.setCurrentCursorPosition(this.$props.value.length, messageBox)
        }
      },
    },
  },
  async mounted() {
    document.addEventListener('selectionchange', this.onSelectionChange)
    // Handle initial value
    this.handleNewValue(this.$props.value)
    // Reset value if in inconsistent state
    if (this.$store.state.ui.chatbarFocus) {
      await this.$store.dispatch('ui/setChatbarFocus', false)
    }
    this.$store.dispatch('ui/setChatbarFocus', true)
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  beforeDestroy() {
    document.removeEventListener('selectionchange', this.onSelectionChange)
  },
  methods: {
    buildChatbarRow(text: string) {
      return `<div class="chat-row-content"><span>${toHTML(text).replace(
        this.$Config.regex.emojiWrapper,
        (emoji: string) => `<span class="emoji">${emoji}</span>`,
      )}<br /></span></div>`
    },
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
    handleInputPaste(e: ClipboardEvent) {
      e.preventDefault()
      const text = e.clipboardData?.getData('text/plain') || ''
      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text)
      } else {
        document.execCommand('paste', false, text)
      }
      this.handlePasteProps(e)
    },
    handleInputKeydown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Backspace':
        case 'Delete':
          if (
            this.$refs?.editable &&
            (this.$refs?.editable as HTMLElement).innerText === '\n'
          ) {
            e.preventDefault()
          }
          return
      }
      this.handleInputKeydownProps(e)
    },
    onSelectionChange() {
      const selection = document.getSelection()
      const messageBox = this.$refs?.editable as HTMLElement
      if (selection && selection.rangeCount > 0) {
        const node = selection.getRangeAt(0)
          .commonAncestorContainer as HTMLElement
        // If the content is just a newline don't select, this will prevent inner html to be deleted from the contenteditable
        if (node.innerText === '\n' && messageBox.innerText === '\n') {
          Cursor.setCurrentCursorPosition(0, messageBox)
        }
      }
    },
    onInput(e: KeyboardEvent) {
      const messageBox = e.target as HTMLElement
      let finalValue = ''
      messageBox.innerText.split('\n\n').forEach((row, i) => {
        finalValue +=
          i === messageBox.innerText.split('\n\n').length - 1
            ? // Remove the final newline on the last row
              row.replace(/\n$/, '')
            : row + '\n' // Close the row
      })
      this.$emit('input', finalValue)
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

  .placeholder {
    z-index: -1;
    color: @text-muted;
    position: absolute;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    left: 0;
    right: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .editable-input {
    width: 100%;
    display: inline-block;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: break-spaces !important;

    .chat-row-content {
      .emoji {
        font-style: initial;
      }

      .md-symbol {
        color: @gray;
      }

      .md-url {
        color: @primary-color;
      }

      .md-lang {
        color: @green;
      }
    }
  }
}
</style>
