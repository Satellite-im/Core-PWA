import { NodeHtmlMarkdown } from 'node-html-markdown'
import { Marked, Renderer } from '@ts-stack/markdown'

Marked.setOptions({
  renderer: new Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
})

/**
 * @method htmlToMarkdown
 * @description Convert element's html to markdown expression
 * @param {string} htmlString - The html expression
 * @returns Makrdown expression
 */
export function htmlToMarkdown(htmlString: string) {
  let markDown =
    htmlString.length > 1
      ? NodeHtmlMarkdown.translate(htmlString.trim())
      : htmlString
  markDown = markDown
    .trim()
    .replace(/\\#/g, '#')
    .replace(/\\`/g, '`')
    .replace(/\\=/g, '=')
    .replace(/\\_/g, '_')
    .replace(/\\>/g, '>')
    .split('\\*')
    .join('*')
    .replace(/_\*/g, '**')
    .replace(/\*_/g, '**')

  return markDown
}

/**
 * @method markDownToHtml
 * @description Convert the markdown expression to html string
 * @param {string} markDown - The markdown expression
 * @returns Converted html expression
 */
export function markDownToHtml(markDown: string) {
  const htmlString = Marked.parse(markDown)
    .replace(/<\/h1>/g, '<span>&nbsp;</span></h1>')
    .replace(/<\/h2>/g, '<span>&nbsp;</span></h2>')
    .replace(/<\/h3>/g, '<span>&nbsp;</span></h3>')
    .replace(/<\/h4>/g, '<span>&nbsp;</span></h4>')
    .replace(/<\/h5>/g, '<span>&nbsp;</span></h5>')
    .replace(/<\/h6>/g, '<span>&nbsp;</span></h6>')
    .replace(/<\/p>/g, '<span>&nbsp;</span></p>')
  return htmlString
}

/**
 * @method getCaretPosition
 * @description Get the current position of caret in DOM element
 * @param {HTMLElement} htmlElement - The DOM element
 * @returns The current position of caret in DOM element
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
 * @param {Node} node - The DOM element
 * @param {number} position - the position of caret to set and must be less than the length of content
 * @example setCaretPosition(document.getElementById('input'), 5) - if caret position exceeds the length of content, it will cause an exception
 */
export function setCaretPosition(node: Node, position: number) {
  if (position < 0) {
    position = node.textContent ? node.textContent.length : 0
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    let sibling: Node | null = node.firstChild
    let offset = 0
    while (sibling) {
      if (sibling.textContent) {
        offset += sibling.textContent.length
        if (offset >= position) {
          setCaretPosition(
            sibling,
            position - (offset - sibling.textContent.length),
          )
          break
        }
      }
      sibling = sibling.nextSibling
    }
  } else {
    setSelection(node, position)
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
