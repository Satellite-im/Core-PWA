<template>
  <div :style="`height: ${rowLength * 24 + 24}px`" class="editable-cointainer">
    <div
      ref="editable"
      contenteditable
      class="editable-input"
      @input="onInput"
      @keydown="handleInputKeydown"
      @keyup="handleInputKeyup"
      @paste="handleInputPaste"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import { marked } from 'marked'

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
            // Get innertText when available (is aware of <br>), otherwise get the textContent
            charCount +=
              (node.innerText
                ? node.innerText?.length
                : node.textContent?.length) || 0
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

// Override function
const renderer = {
  strong: getCustomParser('strong'),
  em: getCustomParser('em'),
  codespan: getCustomParser('codespan'),
  del: getCustomParser('del'),
}

const tokenizer = {
  codespan(src) {
    // Keep only `code` and not ```code```
    const match = src.match(/^(`)([^`]|[^`][\s\S]*?[^`])\1(?!`)/)
    if (match) {
      return {
        type: 'codespan',
        raw: match[0],
        text: match[2],
      }
    }
  },
  br() {},
  link() {},
  image() {},
  text() {},
}

marked.use({ renderer, tokenizer })

function getCustomParser(type) {
  const customParsers = {
    em: (text) => {
      const newText = `<span class="md-symbol">*</span><em>${text}</em><span class="md-symbol">*</span>`
      return newText
    },
    strong: (text) => {
      return `<span class="md-symbol">**</span><strong>${text}</strong><span class="md-symbol">**</span>`
    },
    del: (text) => {
      return `<span class="md-symbol">~</span><del>${text}</del><span class="md-symbol">~</span>`
    },
    codespan: (text) => {
      return `<span class="md-symbol">\`</span><code>${text}</code><span class="md-symbol">\`</span>`
    },
  }

  return customParsers[type]
}

function buildChatbarRow(text) {
  return `<div class="chat-row-content"><span>${text}<br /></span></div>`
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
      rowLength: 1,
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
          rows.push(buildChatbarRow(this.markdownToHtml(line)))
        })
      })

      this.rowLength = rows.length
      messageBox.innerHTML = rows.join('')

      Cursor.setCurrentCursorPosition(pos, messageBox)
    },
  },
  methods: {
    handleInputPaste(event) {
      event.preventDefault()
      console.log('handleInputPaste', event)
      console.log(
        event.clipboardData
          .getData('text/plain')
          .split(/\r\n|\r|\n/)
          .join('\n\n'),
      )
      const cond = parseInnerText(
        (event.originalEvent || event).clipboardData.getData('text/plain'),
      )
      //   document.execCommand('insertHTML', false, cond)
    },
    handleInputKeydown(e) {
      const messageBox = this.$refs.editable
      switch (e.key) {
        case 'Enter':
          if (!e.shiftKey) {
            e.preventDefault()
          }
          return
      }
    },
    handleInputKeyup(e) {
      if (!this.$refs?.editable) return
      const messageBox = this.$refs?.editable

      console.log(
        'Cursor position',
        Cursor.getCurrentCursorPosition(messageBox),
      )
    },
    onInput(e) {
      const messageBox = e.target
      this.$emit('input', messageBox.innerHTML)
    },
    markdownToHtml(mdString) {
      return marked.parseInline(mdString)
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
    height: 100%;
    width: 100%;
    position: absolute;
    padding-top: 12px;
    padding-bottom: 12px;
    display: inline-block;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: break-spaces !important;

    .chat-row-content {
      height: 24px;

      .md-symbol {
        color: grey;
      }
    }
  }
}
</style>
