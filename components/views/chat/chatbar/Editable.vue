<template>
  <div :style="`height: ${chatHeight}px`" class="editable-cointainer">
    <div
      ref="editable"
      contenteditable
      class="editable-input"
      @input="onInput"
      @keydown="handleInputKeydown"
      @paste="handleInputPaste"
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

function buildChatbarRow(text) {
  return `<div class="chat-row-content"><span>${toHTML(
    text,
  )}<br /></span></div>`
}

export default Vue.extend({
  inheritAttrs: true,
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['input'],
  data() {
    return {
      chatHeight: 44, // inital height
    }
  },

  watch: {
    value() {
      if (!this.$refs?.editable) return
      const messageBox = this.$refs?.editable
      const pos = Cursor.getCurrentCursorPosition(messageBox)
      const rows = []
      messageBox.childNodes.forEach((node, index) => {
        // When encountering a newline, create a new row
        node.textContent.split('\n').forEach((line) => {
          rows.push(buildChatbarRow(line))
        })
      })
      this.chatHeight = messageBox.offsetHeight
      messageBox.innerHTML = rows.join('')
      Cursor.setCurrentCursorPosition(pos, messageBox)
    },
  },
  mounted() {
    document.addEventListener('selectionchange', this.onSelectionChange)
  },
  beforeDestroy() {
    document.removeEventListener('selectionchange', this.onSelectionChange)
  },
  methods: {
    handleInputPaste(event) {
      event.preventDefault()
      const text = event.clipboardData.getData('text/plain')
      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text)
      } else {
        document.execCommand('paste', false, text)
      }
    },
    handleInputKeydown(e) {
      switch (e.key) {
        case 'Enter':
          if (!e.shiftKey) {
            e.preventDefault()
          }
          return

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
      this.$emit('input', messageBox.innerHTML)
    },
    markdownToHtml(mdString) {
      return toHTML(mdString)
    },
  },
})
</script>
<style lang="less">
.editable-cointainer {
  position: relative;
  min-height: 48px;
  width: 100%;

  .editable-input {
    width: 100%;
    position: absolute;
    padding-top: 11px;
    padding-bottom: 11px;
    display: inline-block;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: break-spaces !important;
    line-height: 22px;

    .chat-row-content {
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
