<template src="./Input.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { DeleteIcon, SearchIcon } from 'satellite-lucide-icons'

import SearchQuery from '../SearchQuery'
import SearchUtil from '../SearchUtil'
import {
  SearchQueryItem,
  SearchCommandType,
  SearchCommand,
  CalendarDateType,
  SearchRecommend,
  SearchRecommendResultItem,
  SearchOption,
} from '~/types/search/search'

declare module 'vue/types/vue' {
  interface Vue {
    isEmpty: Boolean
    isFocus: Boolean
  }
}

export default Vue.extend({
  components: {
    DeleteIcon,
    SearchIcon,
  },
  props: {
    placeholder: {
      type: String,
      default: 'Search...',
    },
    searchRecommend: {
      type: Object as PropType<SearchRecommend>,
      default: { users: [], channels: [] } as SearchRecommend,
    },
  },
  data() {
    return {
      isFocus: false,
      isEmpty: true,
      searchQuery: new SearchQuery(),
      caretPosition: -1,
      option: -1,
      current: null as SearchQueryItem | null,
      searchResult: [] as SearchRecommendResultItem[],
      searchFor: '',
      search: -1,
    }
  },
  computed: {
    /**
     * @method searchOptions DocsTODO
     * @description
     * @returns
     */
    searchOptions() {
      return SearchUtil.getCommandMetaList()
    },

    /**
     * @method hasOptions DocsTODO
     * @description
     * @returns
     */
    hasOptions(): SearchOption[] {
      return SearchUtil.getCommandTypeParams()[SearchCommandType.Has]
        .options as SearchOption[]
    },

    /**
     * @method isEmptyCommand DocsTODO
     * @description
     * @returns
     */
    isEmptyCommand() {
      if (
        this.current != null &&
        this.current.command === '' &&
        this.current.value === ''
      ) {
        return true
      }
      return false
    },

    /**
     * @method isOption DocsTODO
     * @description
     * @returns
     */
    isOption() {
      if (this.isFocus && (this.isEmpty || this.isHas || this.isEmptyCommand)) {
        return true
      }
      return false
    },

    /**
     * @method isHas DocsTODO
     * @description
     * @returns
     */
    isHas() {
      if (this.current == null || this.current.value !== '') {
        return false
      }
      if (this.current.command === SearchCommand.Has) {
        return true
      }
      return false
    },

    /**
     * @method isDate DocsTODO
     * @description
     * @returns
     */
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

    /**
     * @method isSearch DocsTODO
     * @description
     * @returns
     */
    isSearch() {
      if (this.isEmpty || !this.isFocus || this.current == null) {
        return false
      }
      if (this.current.command === '' && this.current.value === '') {
        return false
      }
      if (this.current.command !== '' && this.current.value === '') {
        return false
      }
      return true
    },
  },
  methods: {
    /**
     * @method _setEmpty DocsTODO
     * @description
     * @param isEmpty
     */
    _setEmpty(isEmpty: boolean) {
      this.isEmpty = isEmpty
    },

    /**
     * @method _desectStatus DocsTODO
     * @description
     */
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

    /**
     * @method _insertBlank DocsTODO
     * @description
     * @param after
     * @returns
     */
    _insertBlank(after: number) {
      this.current = this.searchQuery.insertCommand(
        SearchCommand.Empty,
        '',
        after,
      )
      this._produceItems()
    },

    /**
     * @method _insertOption DocsTODO
     * @description
     * @returns
     */
    _insertOption() {
      if (this.option < 0 || (!this.isEmpty && !this.isEmptyCommand)) {
        return
      }
      this.current = this.searchQuery.queryItemFrom(this.caretPosition)
      const option = this.searchOptions[this.option]
      if (this.current == null) {
        this.current = this.searchQuery.appendCommand(option.name, '')
      } else {
        this.current = this.searchQuery.insertCommand(
          option.name,
          '',
          this.current.index,
        )
      }
      if (this.current) {
        this.caretPosition = this.current.cursorEnd
      }
      this.option = -1
    },

    /**
     * @method _insertHasOption DocsTODO
     * @description
     * @returns
     */
    _insertHasOption() {
      if (this.option < 0 || this.current == null || !this.isHas) {
        return
      }
      const option = this.hasOptions[this.option]
      this.current = this.searchQuery.queryItemFrom(this.caretPosition)
      if (this.current != null) {
        this.searchQuery.setCommandValue(this.current.index, option.value)
        this.caretPosition = this.current.cursorEnd
        this.option = -1
      }
    },

    /**
     * @method _insertSearch DocsTODO
     * @description
     */
    _insertSearch() {
      if (this.search < 0 || !this.searchResult) {
        return
      }
      this.searchQuery.deleteItemFrom(this.caretPosition)

      const search = this.searchResult[this.search] as SearchRecommendResultItem
      this.searchQuery.appendCommand(search.command, search.value.value)
      this.search = -1
      this.current =
        this.searchQuery.queryItems[this.searchQuery.queryItems.length - 1]
      this.caretPosition = this.current.cursorEnd
    },

    /**
     * @method _insertDate DocsTODO
     * @description
     * @param date
     */
    _insertDate(date: string) {
      if (date == null) {
        return
      }
      this.current = this.searchQuery.queryItemFrom(this.caretPosition)
      if (this.current != null) {
        this.searchQuery.setCommandValue(this.current.index, date)
        this.caretPosition = this.current.cursorEnd
      }
    },

    /**
     * @method _prepareItem DocsTODO
     * @description
     * @returns
     */
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

    /**
     * @method _produceItems DocsTODO
     * @description
     */
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

    /**
     * @method _getCaretPosition DocsTODO
     * @description
     * @returns
     */
    _getCaretPosition() {
      const searchInput = this.$refs.searchInput as HTMLElement
      const caretPosition = this.searchQuery.caretPosition(searchInput)
      return caretPosition
    },

    /**
     * @method _setCaretPosition DocsTODO
     * @description
     * @param position
     */
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
            position - queryItem.cursorStart,
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
            el.textContent ? el.textContent.length : 0,
          )
          range.collapse(false)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
        searchInput.focus()
      }
    },

    /**
     * @method _navigatePanel DocsTODO
     * @description
     * @param down
     */
    _navigatePanel(down: boolean) {
      if (this.isEmpty || this.isEmptyCommand || this.isHas) {
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

    /**
     * @method _prepareSearch DocsTODO
     * @description
     */
    _prepareSearch() {
      // this.caretPosition = this._getCaretPosition()
      this.current = this.searchQuery.queryItemFrom(
        this.caretPosition,
      ) as SearchQueryItem
      if (this.current == null) {
        return
      }
      if (this.current.command !== '' && this.current.value === '') {
        return
      }

      this.searchFor = this.searchQuery.getQueryString()
      this._filterSearchResult()
    },

    /**
     * @method _filterSearchResult DocsTODO
     * @description
     */
    _filterSearchResult() {
      this.searchResult = SearchUtil.filterSearchRecommendResult(
        this.searchRecommend,
        this.current,
      )
    },

    /**
     * @method clickOption DocsTODO
     * @description
     * @param i
     */
    clickOption(i: number) {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.option = i
      this._insertOption()
      this._produceItems()
      this._setCaretPosition(this.caretPosition)
      this._detectStatus()
      searchInput.focus()
    },

    /**
     * @method clickHasOption DocsTODO
     * @description
     * @param i
     */
    clickHasOption(i: number) {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.option = i
      this._insertHasOption()
      this._produceItems()
      this._setCaretPosition(this.caretPosition)
      this._detectStatus()
      searchInput.focus()
      this._prepareSearch()
      this.emitSearch()
    },

    /**
     * @method clickSearchOption DocsTODO
     * @description
     * @param i
     */
    clickSearchOption(i: number) {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.search = i
      this._insertSearch()
      this._produceItems()
      this._setCaretPosition(this.caretPosition)
      this._detectStatus()
      searchInput.focus()
      this._prepareSearch()
      this.emitSearch()
    },

    /**
     * @method clickDateOption DocsTODO
     * @description
     * @param day
     */
    clickDateOption(day: CalendarDateType) {
      const searchInput = this.$refs.searchInput as HTMLElement
      this._insertDate(day.id)
      this._produceItems()
      this._setCaretPosition(this.caretPosition)
      this._detectStatus()
      searchInput.focus()
      this._prepareSearch()
      this.emitSearch()
    },

    /**
     * @method input DocsTODO
     * @description
     */
    input() {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.searchQuery.setQueryByHTML(searchInput)
      this.caretPosition = this._getCaretPosition()
      this._detectStatus()
      this._produceItems()
      this._setCaretPosition(this.caretPosition)
      this._prepareSearch()
      this.emitChange()
    },

    /**
     * @method keydown DocsTODO
     * @description
     * @param event
     */
    keydown(event: KeyboardEvent) {
      switch (event.key) {
        case 'Enter':
          event.preventDefault()
          this.caretPosition = this._getCaretPosition()
          this._insertOption()
          this._insertHasOption()
          this._insertSearch()
          this._produceItems()
          this._setCaretPosition(this.caretPosition)
          this._detectStatus()
          this._prepareSearch()
          this.emitSearch()
          break
        case ' ':
        case 'Spacebar':
          this.caretPosition = this._getCaretPosition()
          if (this._prepareItem()) {
            event.preventDefault()
            this._setCaretPosition(this.caretPosition + 1)
          }
          break
        case 'Down':
        case 'ArrowDown':
          event.preventDefault()
          this._navigatePanel(true)
          break
        case 'Up':
        case 'ArrowUp':
          event.preventDefault()
          this._navigatePanel(false)
          break
        case 'Left':
        case 'ArrowLeft':
        case 'Right':
        case 'ArrowRight':
        case 'End':
          this.caretPosition = this._getCaretPosition()
          break
        case 'Backspace':
          {
            const caretPostion = this._getCaretPosition()
            const queryItem = this.searchQuery.queryItemFrom(caretPostion)
            if (queryItem != null && queryItem.command !== '') {
              const sp = caretPostion - queryItem.cursorStart - 1
              if (sp === queryItem.command.length) {
                queryItem.command = SearchCommand.Empty
                if (queryItem.value === '') {
                  this.searchQuery.deleteItemAt(queryItem.index)
                }
                event.preventDefault()
                this._produceItems()
                this._setCaretPosition(queryItem.cursorStart)
                this._detectStatus()
                this._prepareSearch()
              }
            }
          }
          break
        default:
          break
      }
    },

    /**
     * @method keyup DocsTODO
     * @description
     * @param event
     */
    keyup(event: KeyboardEvent) {
      if (event.key === ':') {
        this.caretPosition = this._getCaretPosition()
        this._produceItems()
        this._setCaretPosition(this.caretPosition)
      }
    },

    /**
     * @method clearSearch DocsTODO
     * @description
     */
    clearSearch() {
      const searchInput = this.$refs.searchInput as HTMLElement
      searchInput.innerHTML = ''
      this._detectStatus()
      this.searchQuery.clear()
      searchInput.focus()
      this.current = null
    },

    /**
     * @method setFocus DocsTODO
     * @description
     */
    setFocus() {
      const searchInput = this.$refs.searchInput as HTMLElement
      searchInput.contentEditable = 'true'
      searchInput.autocapitalize = 'off'
      this.isFocus = true
      this.caretPosition = this._getCaretPosition()
    },

    /**
     * @method lostFocus DocsTODO
     * @description
     */
    lostFocus() {
      const searchInput = this.$refs.searchInput as HTMLElement
      searchInput.contentEditable = 'false'
      searchInput.autocapitalize = 'off'
      searchInput.blur()
      this.isFocus = false
    },

    /**
     * @method emitSearch DocsTODO
     * @description
     */
    emitSearch() {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.searchQuery.setQueryByHTML(searchInput)
      this.$emit(
        'search',
        this.searchQuery
          .getQueryString()
          .slice(0, this.$Config.chat.searchCharLimit),
        this.searchQuery.queryItems,
      )
    },

    /**
     * @method emitChange DocsTODO
     * @description
     */
    emitChange() {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.searchQuery.setQueryByHTML(searchInput)
      this.$emit('change', this.searchQuery.getQueryString(), this.current)
    },
  },
})
</script>
<style lang="less" src="./InputGlobal.less"></style>
<style scoped lang="less" src="./Input.less"></style>
<style lang="less">
.search-container {
  .vc-popover-content-wrapper {
    height: 0px !important;
    .vc-popover-content {
      height: 0px !important;
    }
    z-index: -1;
  }
}
</style>
