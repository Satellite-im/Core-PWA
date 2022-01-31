/**
 * @class Cursor
 * @description The Cursor class manages the cursor position in the editable component
 */
export default class Cursor {
  /**
   * @method getCurrentCursorPosition
   * @static
   * @description Get current cursor position
   * @param parentElement Element to get cursor position
   * @returns cursor position
   */
  static getCurrentCursorPosition(parentElement: HTMLElement) {
    const selection = window.getSelection()
    let charCount = -1
    let node

    if (selection && selection.focusNode) {
      if (Cursor._isChildOf(selection.focusNode, parentElement)) {
        node = selection.focusNode as HTMLElement
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
            // if (node.textContent)
            charCount += isNodeRow
              ? (node.textContent?.length || 0) + 1
              : node.textContent?.length || 0
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

  /**
   * @method setCurrentCursorPosition
   * @static
   * @description Set current cursor position
   * @param chars position to set cursor
   * @param element Element to set cursor position
   */
  static setCurrentCursorPosition(chars: number, element: HTMLElement) {
    if (chars >= 0) {
      const selection = window.getSelection()

      const range = Cursor._createRange(element, chars)
      if (range && selection) {
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }

  /**
   * @method _findCursorNode
   * @static
   * @description Recursively find the text node that contains the given character index, or the BR node at the end
   * @param node The node to start searching from
   * @param chars character index
   * @returns [text node, offset]
   */
  static _findCursorNode(
    node: ChildNode,
    chars: { count: number },
  ): [ChildNode | null, number] {
    let offset = 0
    if (node.nodeName === 'BR') {
      return [node, 0]
    }

    if (node.nodeType === Node.TEXT_NODE) {
      if ((node as Text).length > chars.count) {
        offset = chars.count
        return [node, offset]
      }
      chars.count -= (node as Text).length
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

  /**
   * @method _createRange
   * @static
   * @description Create a range object from the given character index
   * @param node The node for the range
   * @param chars character index
   * @param range The range object to create
   * @returns range object
   */
  static _createRange(
    node: HTMLElement,
    chars: number,
    range: Range | null = null,
  ) {
    if (!range) {
      range = document.createRange()
      range.selectNode(node)
      range.setStart(node, 0)
    }

    const rows = node.innerText.split('\n\n')
    let elementIndex = 0

    for (const [row, el] of rows.entries()) {
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

  /**
   * @method _isChildOf
   * @static
   * @description Check if the given node is a child of the given parent
   * @param node The node to check
   * @param parentElement The parent element to check
   * @returns true if the node is a child of the parent
   */
  static _isChildOf(node: Node | null, parentElement: HTMLElement) {
    while (node !== null) {
      if (node === parentElement) {
        return true
      }
      node = node.parentNode
    }

    return false
  }
}
