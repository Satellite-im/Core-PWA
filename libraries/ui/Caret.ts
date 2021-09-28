/**
 * @method getCaretPosition
 * @description Get the current position of caret in DOM element
 * @param {HTMLElement} htmlElement - The DOM element
 * @returns the current position of caret in DOM element
 * @example console.log(getCaretPosition(document.getElementById('input')))
 */
export function getCaretPosition(htmlElement: HTMLElement): number {
  if (!window.getSelection) {
    return 0
  }

  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) {
    return 0
  }

  const range = sel.getRangeAt(0)
  let caretPosInNode = range.endOffset
  let itemNode = range.commonAncestorContainer
  while (itemNode !== htmlElement) {
    caretPosInNode = caretPositionInParentNode(itemNode, caretPosInNode)
    itemNode = itemNode.parentNode as Node
  }
  return caretPosInNode
}

/**
 * @method setCaretPosition
 * @description Set the current position of caret in DOM element
 * @param {HTMLElement} htmlElement - The DOM element
 * @param {number} position - the position of caret to set and must be less than the length of content
 * @example setCaretPosition(document.getElementById('input'), 5) - if caret position exceeds the length of content, it will cause an exception
 */
export function setCaretPosition(htmlElement: HTMLElement, position: number) {
  if (htmlElement.textContent) {
    if (htmlElement.textContent.length <= position) {
      position = htmlElement.textContent.length
    }
  }

  let offset = 0
  let bset = false
  if (htmlElement.firstChild) {
    htmlElement.childNodes.forEach((child) => {
      if (child.textContent && !bset) {
        const toffset = offset + child.textContent.length
        if (toffset > position) {
          setCaretPosition(child as HTMLElement, position - offset)
          bset = true
        }
        offset = toffset
      }
    })
  } else {
    setSelection(htmlElement, position)
  }
}

/**
 * @method setSelection
 * @description Set the caret position in Node by using window's selection and range
 * @param {Node} node - The DOM Node
 * @param {number} position - The position of caret to set
 */
function setSelection(node: Node, position: number) {
  const selection = window.getSelection()
  if (!selection) {
    return
  }
  const range = new Range()
  range.setStart(node, position < 0 ? 0 : position)
  range.collapse(false)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

/**
 * @method caretPositionInParentNode
 * @description Get the caret position absolutely in Parent Node
 * @param {Node} node - The DOM Node
 * @param {number} caretPosInNode - The position of caret in node
 * @returns the caret position in Parent Node
 */
function caretPositionInParentNode(node: Node, caretPosInNode: number): number {
  let itemNode = node.parentNode?.firstChild
  let caretPos = caretPosInNode
  while (node !== itemNode) {
    const content = (itemNode as HTMLElement).textContent
    caretPos += content ? content.length : 0
    itemNode = (itemNode as HTMLElement).nextSibling
  }
  return caretPos
}
