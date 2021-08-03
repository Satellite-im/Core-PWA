<template src="./Search.html"></template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import VCalendar from 'v-calendar'
import SearchQuery from './SearchQuery'
import {
  SearchQueryItem,
  SearchCommandList,
  SearchItemList,
  SearchResultItem,
  SearchCommandTypeParams,
  SearchCommandType,
  SearchCommand,
  CalendarDateType,
} from './Types'

Vue.use(VCalendar)

declare module 'vue/types/vue' {
  interface Vue {
    isEmpty: Boolean
    isFocus: Boolean
    queries: Array<SearchQuery>
  }
}

export default Vue.extend({
  props: {
    placeholder: {
      type: String,
      default: 'Search...',
    },
  },
  data() {
    return {
      isFocus: false,
      isEmpty: true,
      queries: [] as Array<SearchQuery>,
      searchQuery: new SearchQuery(),
      caretPosition: -1,
      option: -1,

      current: null as SearchQueryItem | null,
      searchResult: [] as Array<Object> | undefined,
      searchFor: '',
      search: -1,
    }
  },
  computed: {
    searchOptions() {
      return SearchCommandList
    },
    hasOptions() {
      return SearchCommandTypeParams[SearchCommandType.Has].values
    },
    isOption() {
      if (this.isFocus && (this.isEmpty || this.isHas)) {
        return true
      }
      return false
    },
    isHas() {
      if (this.current == null || this.current.value !== '') {
        return false
      }
      if (this.current.command === SearchCommand.Has) {
        return true
      }
      return false
    },
    isDate() {
      if (this.current == null || this.current.value !== '') {
        return false
      }
      if (
        this.current.command === SearchCommand.Before ||
        this.current.command === SearchCommand.During ||
        this.current.command === SearchCommand.After
      ) {
        return true
      }
      return false
    },
    isSearch() {
      if (this.isEmpty || !this.isFocus || this.current == null) {
        return false
      }
      if (this.current.command !== '' && this.current.value === '') {
        return false
      }
      return true
    },
  },
  methods: {
    _setEmpty(isEmpty: boolean) {
      this.isEmpty = isEmpty
    },
    _detectStatus() {
      const searchInput = this.$refs.searchInput as HTMLElement
      if (searchInput.textContent === '') {
        searchInput.innerHTML = ''
        this.searchQuery.clear()
        this._setEmpty(true)
      } else {
        this._setEmpty(false)
      }
    },
    _insertBlank(after: number) {
      this.searchQuery.insertBlank(after)
      this._produceItems()
    },
    _insertOption() {
      if (this.option < 0 || !this.isEmpty) {
        return
      }
      const option = this.searchOptions[this.option]
      this.searchQuery.appendCommand(option.name, '')
      this.caretPosition += option.name.length + 1
      this.option = -1
      this.current =
        this.searchQuery.queryItems[this.searchQuery.queryItems.length - 1]
    },
    _insertHasOption() {
      if (this.option < 0 || this.current == null || !this.isHas) {
        return
      }
      const option = this.hasOptions[this.option]
      this.current.value = option
      this.current.cursorEnd += option.length
      this.caretPosition += option.length + 1
      this.option = -1
    },
    _insertSearch() {
      if (this.search < 0 || !this.searchResult) {
        return
      }
      this.caretPosition = this._getCaretPosition()
      this.searchQuery.deleteItemFrom(this.caretPosition)

      const search = this.searchResult[this.search] as SearchResultItem
      this.searchQuery.appendCommand(search.command, search.value)
      this.caretPosition += search.command.length + search.value.length + 1
      this.search = -1
      this.current =
        this.searchQuery.queryItems[this.searchQuery.queryItems.length - 1]
    },
    _insertDate(date: string) {
      if (date == null || this.current == null) {
        return
      }
      this.current.value = date
      this.current.cursorEnd += date.length
      this.caretPosition += date.length + 1
    },
    _prepareItem() {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.caretPosition = this.searchQuery.caretPosition(searchInput)
      let happens = false
      this.searchQuery.queryItems.forEach((queryItem: SearchQueryItem) => {
        if (this.caretPosition === queryItem.cursorEnd) {
          this._insertBlank(queryItem.index)
          happens = true
        }
      })
      return happens
    },
    _produceItems() {
      const searchInput = this.$refs.searchInput as HTMLElement
      searchInput.innerHTML = ''
      this.searchQuery.queryItems.forEach((queryItem: SearchQueryItem) => {
        if (queryItem.index > 0) {
          const blank: HTMLElement = document.createElement('span')
          blank.innerHTML = '&nbsp;'
          searchInput.appendChild(blank)
        }
        const newElement: HTMLElement = document.createElement('span')
        newElement.spellcheck = false
        if (queryItem.command !== '') {
          newElement.classList.add('search-query-highlight')
          newElement.innerHTML += [queryItem.command, queryItem.value].join(':')
        } else {
          newElement.innerHTML += queryItem.value
        }
        searchInput.appendChild(newElement)
      })
    },
    _getCaretPosition() {
      const searchInput = this.$refs.searchInput as HTMLElement
      const caretPosition = this.searchQuery.caretPosition(searchInput)
      return caretPosition
    },
    _setCaretPosition(position: number) {
      const selection = window.getSelection()
      if (!selection) {
        return
      }
      let hasSet = false
      const searchInput = this.$refs.searchInput as HTMLElement
      this.searchQuery.queryItems.forEach((queryItem: SearchQueryItem) => {
        if (
          position >= queryItem.cursorStart &&
          position <= queryItem.cursorEnd
        ) {
          const el = searchInput.childNodes[queryItem.index * 2]
          const range = new Range()
          range.setStart(
            el.firstChild === null ? el : el.firstChild,
            position - queryItem.cursorStart
          )
          range.collapse(false)
          selection?.removeAllRanges()
          selection?.addRange(range)
          searchInput.focus()
          hasSet = true
        }
      })
      if (!hasSet) {
        const el = searchInput.lastChild
        if (el) {
          const range = new Range()
          range.setStart(
            el.firstChild === null ? el : el.firstChild,
            el.textContent ? el.textContent.length : 0
          )
          range.collapse(false)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
        searchInput.focus()
      }
    },
    _navigatePanel(down: boolean) {
      if (this.isEmpty || this.isHas) {
        if (down === true) {
          if (this.option < this.searchOptions.length - 1) {
            this.option++
          } else {
            this.option = 0
          }
        } else if (this.option > 0) {
          this.option--
        } else {
          this.option = this.searchOptions.length - 1
        }
      } else if (this.searchResult) {
        if (down === true) {
          if (this.search < this.searchResult.length - 1) {
            this.search++
          } else {
            this.search = 0
          }
        } else if (this.search > 0) {
          this.search--
        } else {
          this.search = this.searchResult.length - 1
        }
      }
    },
    _prepareSearch() {
      this.caretPosition = this._getCaretPosition()
      this.current = this.searchQuery.queryItemFrom(
        this.caretPosition
      ) as SearchQueryItem
      if (this.current == null) {
        return
      }
      if (this.current.command !== '' && this.current.value === '') {
        return
      }

      this.searchFor = ''
      const queryItems = [] as Array<string>
      this.searchQuery.queryItems.forEach((queryItem) => {
        queryItems.push(
          queryItem.command +
            (queryItem.command !== '' ? ':' : '') +
            queryItem.value
        )
      })
      this.searchFor = queryItems.join(' ')

      this.searchResult = SearchItemList.filter((item) => {
        if (this.current != null) {
          if (this.current.command !== '') {
            return (
              this.current.command.indexOf(item.command) === 0 &&
              item.value
                .toLowerCase()
                .indexOf(this.current.value.toLowerCase()) === 0
            )
          } else {
            return (
              item.value
                .toLowerCase()
                .indexOf(this.current.value.toLowerCase()) === 0
            )
          }
        }
        return false
      }) as Array<Object> | undefined
    },
    clickOption(i: number) {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.option = i
      this.caretPosition = this._getCaretPosition()
      this._insertOption()
      this._produceItems()
      this._setCaretPosition(this.caretPosition)
      this._detectStatus()
      searchInput.focus()
    },
    clickHasOption(i: number) {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.option = i
      this.caretPosition = this._getCaretPosition()
      this._insertHasOption()
      this._produceItems()
      this._setCaretPosition(this.caretPosition)
      this._detectStatus()
      searchInput.focus()

      this._prepareSearch()
    },
    clickSearch(i: number) {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.search = i
      this.caretPosition = this._getCaretPosition()
      this._insertSearch()
      this._produceItems()
      this._setCaretPosition(this.caretPosition)
      this._detectStatus()
      searchInput.focus()

      this._prepareSearch()
    },
    clickDate(day: CalendarDateType) {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.caretPosition = this._getCaretPosition()
      this._insertDate(day.id)
      this._produceItems()
      this._setCaretPosition(this.caretPosition)
      this._detectStatus()
      searchInput.focus()

      this._prepareSearch()
    },
    input() {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.searchQuery.setQueryByHTML(searchInput)
      this.caretPosition = this._getCaretPosition()
      this._detectStatus()
      this._produceItems()
      this._setCaretPosition(this.caretPosition)
      this._prepareSearch()
    },
    keydown(event: KeyboardEvent) {
      const searchInput = this.$refs.searchInput as HTMLElement
      if (event.key === 'Enter') {
        event.preventDefault()
        this.caretPosition = this._getCaretPosition()
        this.$emit('change', searchInput.innerText)
        this._insertOption()
        this._insertHasOption()
        this._insertSearch()
        this._produceItems()
        this._setCaretPosition(this.caretPosition)
        this._detectStatus()

        this._prepareSearch()
      } else if (event.key === ' ' || event.key === 'Spacebar') {
        this.caretPosition = this._getCaretPosition()
        if (this._prepareItem()) {
          event.preventDefault()
          this._setCaretPosition(this.caretPosition + 1)
        }
      } else if (event.key === 'Down' || event.key === 'ArrowDown') {
        event.preventDefault()
        this._navigatePanel(true)
      } else if (event.key === 'Up' || event.key === 'ArrowUp') {
        event.preventDefault()
        this._navigatePanel(false)
      }
    },
    keyup(event: KeyboardEvent) {
      if (event.key === ':') {
        this.caretPosition = this._getCaretPosition()
        this._produceItems()
        this._setCaretPosition(this.caretPosition)
      }
    },
    clearSearch() {
      const searchInput = this.$refs.searchInput as HTMLElement
      searchInput.innerHTML = ''
      this._detectStatus()
      this.searchQuery.clear()
      searchInput.focus()
      this.current = null
    },
    setFocus() {
      const searchInput = this.$refs.searchInput as HTMLElement
      searchInput.contentEditable = 'true'
      this.isFocus = true
    },
    lostFocus() {
      const searchInput = this.$refs.searchInput as HTMLElement
      searchInput.contentEditable = 'false'
      searchInput.blur()
      this.isFocus = false
    },
  },
})
</script>
<style lang="less" src="./SearchGlobal.less"></style>
<style scoped lang="less" src="./Search.less"></style>
