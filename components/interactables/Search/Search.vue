<template src="./Search.html"></template>
<script lang="ts">
import Vue from 'vue'
import SearchQuery from './SearchQuery'

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
    }
  },
  computed: {},
  mounted() {},
  methods: {
    _setEmpty() {
      const searchInput = this.$refs.searchInput as HTMLElement
      this.isEmpty = !searchInput.textContent
    },
    keyup(event: KeyboardEvent) {
      const searchInput = this.$refs.searchInput as HTMLElement
      const searchQuery = new SearchQuery()
      searchQuery.setQueryByHTML(searchInput)
      switch (event.key) {
        case ':':
          break
      }
      return false
    },
    input() {
      this._setEmpty()
    },
    keypress(event: KeyboardEvent) {
      const searchInput = this.$refs.searchInput as HTMLElement
      if (event.key === 'Enter') {
        event.preventDefault()
        this.$emit('change', searchInput.innerText)
        return false
      }
      // this._setEmpty()
      return true
    },
    clearSearch() {
      const searchInput = this.$refs.searchInput as HTMLElement
      searchInput.innerHTML = ''
      this._setEmpty()
    },
    setFocus() {
      this.isFocus = true
    },
    lostFocus() {
      this.isFocus = false
    },
  },
})
</script>
<style scoped lang="less" src="./Search.less"></style>
