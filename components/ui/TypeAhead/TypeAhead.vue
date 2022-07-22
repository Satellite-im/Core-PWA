<template src="./TypeAhead.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { Suggestion } from 'minisearch'
import { DeleteIcon } from 'satellite-lucide-icons'
import { InputSize, InputStyle } from '~/components/interactables/Input/types'
import SearchIndex from '~/libraries/SatelliteDB/SearchIndex'

export default Vue.extend({
  components: {
    DeleteIcon,
  },
  props: {
    /**
     * List for showing typeahead items
     */
    list: {
      type: Array as PropType<Array<String | Object>>,
      default: () => [],
    },
    /**
     * Method to call when an item is selected
     */
    onSelected: {
      type: Function,
      default: () => () => {},
    },
    /**
     * Size of the input, reference InputSize types or Bulma.io
     */
    size: {
      type: String as PropType<InputSize>,
      default: 'normal',
      required: false,
    },
    /**
     * Key to point label when object array passed
     */
    label: {
      type: String,
      default: '',
      required: false,
    },
    /**
     * Style of the input, reference InputStyle types or Bulma.io
     */
    type: {
      type: String as PropType<InputStyle>,
      required: false,
      default: 'normal',
    },
    /**
     * Number of matches / selected items
     */
    currentMatches: {
      type: Number,
      required: true,
    },

    /**
     * Max number of possible matches / selection
     */
    maxMatches: {
      type: Number,
      required: true,
    },
    /**
     * Placeholder text for blank inputs
     */
    placeholder: {
      type: String,
      default: 'Placeholder...',
    },
    /**
     * Placeholder text for blank inputs
     */
    maxShowCounts: {
      type: Number,
      default: 8,
      required: false,
    },
    /**
     * Clear icon to clear the input
     */
    clearIcon: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    const records = this.list.map((item) => {
      const id = this.label ? (item as any)[this.label] : item
      return { id }
    })
    return {
      searchText: '',
      searchResults: [] as Array<string | Object>,
      searchIndex: new SearchIndex({
        schema: { fields: ['id'] },
        records,
      }),
      isFocus: false,
      browseIndex: -1,
    }
  },
  watch: {
    list() {
      this.update()
    },
    searchText() {
      this.update()
    },
  },
  methods: {
    update() {
      if (!this.searchText) {
        this.searchResults = []
        return
      }
      if (!this.isFocus) this.isFocus = true

      const suggestions = this.searchIndex.autoSuggest(this.searchText)

      this.$emit('onRecoverPhraseError', false)

      this.onMatch(suggestions)

      this.browseIndex = 0
      this.searchResults = suggestions
        .map((match) => match.suggestion)
        .slice(0, this.maxShowCounts)
    },
    onMatch(suggestions: Suggestion[]) {
      if (this.searchText === '') {
        return
      }

      let match = false

      let searchTextSplitted = this.searchText.trim().toLowerCase().split(' ')
      const numberOfMatchesLeft =
        this.maxMatches - (this.currentMatches + searchTextSplitted.length)

      if (searchTextSplitted.length > 1) {
        let doesEveryOccurrenceMatch = true

        for (const text of searchTextSplitted) {
          if (
            !suggestions.find((item) => item.suggestion === text.toLowerCase())
          ) {
            doesEveryOccurrenceMatch = false
            break
          }
        }

        if (doesEveryOccurrenceMatch) {
          const numberOfCurrentMatchesLeft =
            this.maxMatches - this.currentMatches

          if (numberOfCurrentMatchesLeft > 0) {
            match = true

            if (numberOfMatchesLeft < 0) {
              searchTextSplitted = searchTextSplitted.slice(
                0,
                numberOfCurrentMatchesLeft,
              )
            }
          }
        } else {
          this.$emit('onRecoverPhraseError', true)
        }
      } else if (
        suggestions.find(
          (item) => item.suggestion === this.searchText.toLowerCase(),
        ) &&
        numberOfMatchesLeft >= 0 &&
        suggestions.length === 1
      ) {
        match = true
      }

      if (match) {
        this.$emit('onMatch', searchTextSplitted)
        this.isFocus = false
        this.searchText = ''
      }
    },
    setFocus() {
      this.isFocus = true
    },
    lostFocus() {
      this.isFocus = false
    },
    onItemHighlighted(index: number) {
      this.browseIndex = index
    },
    onItemClicked(item: any, index: number) {
      this.onItemHighlighted(index)
      this.$emit('onSelected', item)
      this.isFocus = false
      this.searchText = ''
    },
    onMultipleItemSelected(items: any) {
      this.$emit('onMultipleSelected', items)
      this.isFocus = false
      this.searchText = ''
    },
    onUpBrowseItem(event: KeyboardEvent) {
      event.preventDefault()
      if (this.browseIndex > 0) {
        this.browseIndex--
      }
    },
    onDownBrowseItem(event: KeyboardEvent) {
      event.preventDefault()
      if (this.browseIndex < this.searchResults.length - 1) {
        this.browseIndex++
      }
    },
    onEnterPressed() {
      const item =
        this.browseIndex !== -1 ? this.searchResults[this.browseIndex] : null
      const itemSplitted = this.searchText.trim().toLowerCase().split(' ')
      if (itemSplitted.length > 1) {
        this.onMultipleItemSelected(itemSplitted)
      } else if (item) {
        this.onItemClicked(item, this.browseIndex)
      }
    },
    clearSearch() {
      this.$emit('onRecoverPhraseError', false)
      this.searchText = ''
    },
  },
})
</script>
<style scoped lang="less" src="./TypeAhead.less"></style>
