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

  clear() {
    this.query = ""
    this.cursorPosition = 0
    this.queryIndex = 0
    this.queryItems = []
  }

  insertBlank(position: number) {
    if (position >= this.queryItems.length) {
      return;
    }
    let target = this.queryItems[position]
    let prepend = this.queryItems.slice(0, position + 1)
    let append = this.queryItems.slice(position + 1)
    let newItem = {
      command: SearchCommand.Empty,
      value: "",
      index: position + 1,
      cursorStart: target.cursorEnd + 1,
      cursorEnd: target.cursorEnd + 2
    }
    prepend.push(newItem)

    const offset = newItem.cursorEnd - target.cursorStart
    append.forEach((queryItem: SearchQueryItem) => {
      queryItem.cursorStart += offset
      queryItem.cursorEnd += offset
      queryItem.index++
      prepend.push(queryItem)
    })

    this.queryItems = prepend
  }

  appendCommand(command: SearchCommand, value: string) {
    let last = this.queryItems[this.queryItems.length - 1]
    let newItem = {
      command: command,
      value,
      index: this.queryItems.length,
      cursorStart: last ? last.cursorEnd + 1 : 0,
      cursorEnd: (last ? last.cursorEnd + 1 : 0) + command.length
    } as SearchQueryItem
    this.queryItems.push(newItem)
  }

  queryItemFrom(caretPositon: number) : SearchQueryItem | null {
    let found = null
    this.queryItems.forEach((queryItem) => {
      if (queryItem.cursorStart <= caretPositon && queryItem.cursorEnd >= caretPositon) {
        found = queryItem
      }
    })
    return found
  }

  deleteItemFrom(caretPositon: number) {
    this.queryItems.forEach((queryItem) => {
      if (queryItem.cursorStart <= caretPositon && queryItem.cursorEnd >= caretPositon) {
        this.queryItems.splice(queryItem.index, 1)
      }
    })
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
      this.caretPosition(html)
    )
  }

  caretPosition(htmlElement: HTMLElement): number {
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

  _parseQuery(query: string, cursorPosition: number) {
    const strQuerySplits = query.trim().split('\u00A0')
    strQuerySplits.forEach((v, i) => {
      if (v == "") {
        strQuerySplits.splice(i, 1)
      }
    })
    let queryIndex = 0
    let cursorStart = 0
    const queryItems = strQuerySplits.map((strQuery: string, index: number) => {
      let command = SearchCommand.Empty
      let value = strQuery
      for (const commandText in TextCommandMap) {
        if (strQuery.indexOf(commandText) === 0) {
          const commandValue = strQuery.substr(commandText.length + 1)
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
      let newItem = { command, value, cursorStart, cursorEnd: cursorStart + strQuery.length, index }
      cursorStart += strQuery.length + 1
      return newItem
    })
    return { queryItems, queryIndex }
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
