<template src="./Statusbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { User, Server } from '~/types/ui/core'
import { searchRecommend } from '~/mock/search'
import { SearchQueryItem } from '~/types/search/search'
declare module 'vue/types/vue' {
  interface Vue {
    search: any
    ui: any
  }
}
export default Vue.extend({
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    server: {
      type: Object as PropType<Server>,
      default: () => {},
    },
    user: {
      type: Object as PropType<User>,
      default: () => ({
        name: '',
        address: '',
        status: '',
      }),
      required: true,
    },
  },
  data() {
    return {
      searchRecommend,
    }
  },
  computed: {
    ...mapState(['ui', 'search']),
    showSearchResult: {
      set(state) {
        this.$store.commit('showSearchResult', state)
      },
      get() {
        return this.ui.showSearchResult
      },
    },
    searchQuery: {
      set(state) {
        this.$store.commit('setSearchQuery', state)
      },
      get() {
        return this.search.query
      },
    },
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleChange(value: string, item: SearchQueryItem) {
      // console.log('change-search-input:', value, item)
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSearch(value: string, items: SearchQueryItem[]) {
      this.showSearchResult = true
      this.searchQuery = value
    },
    toggleSearchResult() {
      this.showSearchResult = !this.showSearchResult
    },
    toggleMarketPlace() {
      this.$store.commit('toggleModal', {
        name: 'showMarketPlace',
        state: !this.ui.modals.showMarketPlace,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Statusbar.less"></style>
