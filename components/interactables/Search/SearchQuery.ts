import { SearchCommand, SearchQueryItem, TextCommandMap } from './Types'

export default class SearchQuery {
  query: string
  cursorPosition: number
  queryIndex: number
  queryItems: Array<SearchQueryItem>

  constructor() {
    this.query = ''
    this.cursorPosition = 0
    this.queryIndex = 0
    this.queryItems = []
  }

  setQuery(query: string, cursorPosition: number) {
    this.query = query
    this.cursorPosition = cursorPosition
    const { queryItems, queryIndex } = this._parseQuery(query, cursorPosition)
    this.queryIndex = queryIndex
    this.queryItems = queryItems
  }

  setQueryByHTML(html: HTMLElement) {
    this.setQuery(
      html.textContent ? html.textContent : '',
      this._caretPosition(html)
    )
  }

  _parseQuery(query: string, cursorPosition: number) {
    const strQuerySplits = query.split(' ')
    let queryIndex = 0
    let cursorStart = 0
    const queryItems = strQuerySplits.map((strQuery: string, index: number) => {
      let command = SearchCommand.Empty
      let value = strQuery
      for (const commandText in TextCommandMap) {
        if (strQuery.indexOf(commandText) === 0) {
          const commandValue = strQuery.substr(commandText.length)
          command = TextCommandMap[commandText]
          value = commandValue
          break
        }
      }
      if (
        cursorPosition >= cursorStart &&
        cursorPosition <= cursorStart + strQuery.length
      ) {
        queryIndex = index
      }
      cursorStart += strQuery.length + 1
      return { command, value }
    })
    return { queryItems, queryIndex }
  }

  _caretPosition(htmlElement: HTMLElement): number {
    if (!window.getSelection) {
      return 0
    }

    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) {
      return 0
    }

    const range = sel.getRangeAt(0)
    if (!this._hasAncestor(range.commonAncestorContainer, htmlElement)) {
      return 0
    }
    let caretPosInNode = range.endOffset
    let itemNode = range.commonAncestorContainer

    while (itemNode !== htmlElement) {
      caretPosInNode = this._caretPositionInParentNode(itemNode, caretPosInNode)
      itemNode = itemNode.parentNode as Node
    }
    return caretPosInNode
  }

  _caretPositionInParentNode(node: Node, caretPosInNode: number): number {
    let itemNode = node.parentNode?.firstChild
    let caretPos = caretPosInNode
    while (node !== itemNode) {
      const content = (itemNode as HTMLElement).textContent
      caretPos += content ? content.length : 0
      itemNode = (itemNode as HTMLElement).nextSibling
    }
    return caretPos
  }

  _hasAncestor(node: Node, parentNode: Node) {
    let tempNode: Node | null = node
    do {
      if (tempNode === parentNode) {
        return true
      }
      tempNode = (tempNode as Node).parentNode
    } while (tempNode !== null)
    return false
  }
}
