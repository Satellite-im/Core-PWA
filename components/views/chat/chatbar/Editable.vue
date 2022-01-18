<template>
  <div class="editable-cointainer">
    <div v-if="value.length === 0" class="placeholder">{{ placeholder }}</div>
    <div
      ref="editable"
      v-focus="focusValue"
      :contenteditable="recipient ? true : false"
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
  </div>
</template>
<script>
import Vue from 'vue'
import { toHTML } from '~/libraries/ui/Markdown'

class Cursor {
  static getCurrentCursorPosition(parentElement) {
    const selection = window.getSelection()
    let charCount = -1
    let node

    if (selection.focusNode) {
      if (Cursor._isChildOf(selection.focusNode, parentElement)) {
        node = selection.focusNode
        charCount += node.innerText
          ? node.innerText?.length
          : // + 1 because of the newline that focusOffset doesn't count
            selection.focusOffset + 1

        while (node) {
          if (node === parentElement) {
            break
          }

          if (node.previousSibling) {
            node = node.previousSibling
            const isNodeRow = node.nodeName === 'DIV'
            // If it's a row, add the length of the text plus the newline
            charCount += isNodeRow
              ? node.textContent.length + 1
              : node.textContent.length
          } else {
            node = node.parentNode
            if (node === null) {
              break
            }
          }
        }
      }
    }

    return charCount
  }

  static setCurrentCursorPosition(chars, element) {
    if (chars >= 0) {
      const selection = window.getSelection()

      let range = Cursor._createRange(element, chars)
      if (range) {
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }

  // Recursively find the text node that contains the given character index, or the BR node at the end
  // Return [node, offset]
  static _findCursorNode(node, chars) {
    let offset = 0
    if (node.nodeName === 'BR') {
      return [node, 0]
    }

    if (node.nodeType === Node.TEXT_NODE) {
      if (node.length > chars.count) {
        offset = chars.count
        return [node, offset]
      }
      chars.count -= node.length
      return [null, 0]
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      const [finalNode, finalOffset] = Cursor._findCursorNode(
        node.childNodes[i],
        chars,
      )
      if (finalNode !== null) {
        return [finalNode, finalOffset]
      }
    }

    return [null, 0]
  }

  // Not perfect, can be refactored even better
  static _createRange(node, chars, range) {
    if (!range) {
      range = document.createRange()
      range.selectNode(node)
      range.setStart(node, 0)
    }

    let rows = node.innerText.split('\n\n')
    let elementIndex = 0

    for (let [row, el] of rows.entries()) {
      if (el.length >= chars) {
        elementIndex = row
        break
      } else {
        chars -= el.length + 1
      }
    }

    const finalRowDiv = node.childNodes[elementIndex]

    if (!finalRowDiv || !finalRowDiv.childNodes.length) {
      return null
    }

    const span = finalRowDiv.childNodes[0]
    const [cursorNode, finalOffset] = Cursor._findCursorNode(span, {
      count: chars,
    })

    if (cursorNode) {
      range.setEnd(cursorNode, finalOffset)
      return range
    }

    return range
  }

  static _isChildOf(node, parentElement) {
    while (node !== null) {
      if (node === parentElement) {
        return true
      }
      node = node.parentNode
    }

    return false
  }
}

export default Vue.extend({
  directives: {
    focus: {
      update(el, { value, oldValue }, vnode) {
        if (value && value !== oldValue) {
          el.focus()
          Cursor.setCurrentCursorPosition(vnode.context.$props.value.length, el)
        }
      },
    },
  },
  inheritAttrs: true,
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    recipient: {
      type: Object,
      default: null,
    },
    focusValue: {
      type: String,
      default: '',
    },
    handleInputKeydownProps: {
      type: Function,
      default: () => {},
    },
    handleInputKeyupProps: {
      type: Function,
      default: () => {},
    },
    handleDropProps: {
      type: Function,
      default: () => {},
    },
    handlePasteProps: {
      type: Function,
      default: () => {},
    },
  },
  emits: ['input'],
  watch: {
    value(newValue) {
      this.handleNewValue(newValue)
    },
    recipient() {
      if (!this.$refs?.editable) return
      const messageBox = this.$refs?.editable
      Cursor.setCurrentCursorPosition(this.$props.value.length, messageBox)
    },
  },
  mounted() {
    document.addEventListener('selectionchange', this.onSelectionChange)
    // Handle initial value
    this.handleNewValue(this.$props.value)
  },
  beforeDestroy() {
    document.removeEventListener('selectionchange', this.onSelectionChange)
  },
  methods: {
    buildChatbarRow(text) {
      return `<div class="chat-row-content"><span>${toHTML(text).replace(
        this.$Config.regex.emojiWrapper,
        (emoji) => `<span class="emoji">${emoji}</span>`,
      )}<br /></span></div>`
    },
    handleNewValue(newValue) {
      if (!this.$refs?.editable) return
      const messageBox = this.$refs?.editable
      const pos = Cursor.getCurrentCursorPosition(messageBox)
      const rows = []
      newValue.split('\n').forEach((row) => {
        // When encountering a newline, create a new row
        row.split('\n').forEach((line) => {
          rows.push(this.buildChatbarRow(line))
        })
      })
      messageBox.innerHTML = rows.join('')
      Cursor.setCurrentCursorPosition(pos, messageBox)
    },
    handleInputPaste(e) {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text)
      } else {
        document.execCommand('paste', false, text)
      }
      this.handlePasteProps(e)
    },
    handleInputKeydown(e) {
      switch (e.key) {
        case 'Backspace':
        case 'Delete':
          if (
            this.$refs?.editable &&
            Cursor.getCurrentCursorPosition(this.$refs?.editable) === 0
          ) {
            e.preventDefault()
          }
          return
      }
      this.handleInputKeydownProps(e)
    },
    onSelectionChange() {
      const selection = document.getSelection()
      const messageBox = this.$refs?.editable
      if (selection && selection.rangeCount > 0) {
        const node = selection.getRangeAt(0).commonAncestorContainer
        // If the content is just a newline don't select, this will prevent inner html to be deleted from the contenteditable
        if (node.innerText === '\n' && messageBox.innerText === '\n') {
          Cursor.setCurrentCursorPosition(0, messageBox)
        }
      }
    },
    onInput(e) {
      const messageBox = e.target
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
  .editable-cointainer {
    .chat-row-content {
      // Chrome bug for emoji spacing on non-retina screens
      .emoji {
        letter-spacing: 4px;
      }
    }
  }
}

.editable-cointainer {
  position: relative;
  min-height: 48px;
  width: 100%;

  .placeholder {
    z-index: -1;
    color: @text-muted;
    position: absolute;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding-top: 11px;
    padding-bottom: 11px;
    left: 0;
    right: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .editable-input {
    width: 100%;
    padding-top: 11px;
    padding-bottom: 11px;
    display: inline-block;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: break-spaces !important;
    line-height: 22px;

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
