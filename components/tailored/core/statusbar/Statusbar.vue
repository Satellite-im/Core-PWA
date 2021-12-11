<template src="./Statusbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  PhoneCallIcon,
  VideoIcon,
  ArchiveIcon,
  ShoppingBagIcon,
  CircleIcon,
  WalletIcon,
} from 'satellite-lucide-icons'

import { mapState } from 'vuex'
import { Server } from '~/types/ui/core'
import { User } from '~/types/ui/user'
import { searchRecommend } from '~/mock/search'
import { SearchQueryItem } from '~/types/search/search'
declare module 'vue/types/vue' {
  interface Vue {
    search: any
    ui: any
  }
}
export default Vue.extend({
  components: {
    PhoneCallIcon,
    VideoIcon,
    ArchiveIcon,
    ShoppingBagIcon,
    CircleIcon,
    WalletIcon,
  },
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
        this.$store.commit('ui/showSearchResult', state)
      },
      get() {
        return this.ui.showSearchResult
      },
    },
    searchQuery: {
      set(state) {
        this.$store.commit('search/setSearchQuery', state)
      },
      get() {
        return this.search.query
      },
    },
  },
  methods: {
    /**
     * @method handleChange DocsTODO
     * @description
     * @param value
     * @param item
     * @example
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleChange(value: string, item: SearchQueryItem) {
      // console.log('change-search-input:', value, item)
    },
    /**
     * @method handleSearch DocsTODO
     * @description
     * @param value
     * @param item
     * @example
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSearch(value: string, items: SearchQueryItem[]) {
      this.showSearchResult = true
      this.searchQuery = value
    },
    /**
     * @method toggleSearchResult DocsTODO
     * @description
     * @example
     */
    toggleSearchResult() {
      this.showSearchResult = !this.showSearchResult
    },
    /**
     * @method toggleMarketPlace DocsTODO
     * @description
     * @example
     */
    toggleMarketPlace() {
      this.$store.commit('ui/toggleModal', {
        name: 'showMarketPlace',
        state: !this.ui.modals.showMarketPlace,
      })
    },
    toggleWallet() {
      this.$store.commit('ui/toggleModal', {
        name: 'wallet',
        state: !this.ui.modals.wallet,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Statusbar.less"></style>
