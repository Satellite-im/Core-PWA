<template src="./Result.html"></template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import VuejsPaginate from 'vuejs-paginate'
import { CalendarIcon } from 'satellite-lucide-icons'

import { mapState } from 'vuex'
import SearchUtil from '../SearchUtil'
import { SearchOrderType, SearchResultGroupType } from '~/types/search/search'
import { DataStateType } from '~/store/dataState/types'
import { searchResult } from '~/mock/search'

Vue.component('Paginate', VuejsPaginate)

declare module 'vue/types/vue' {
  interface Vue {
    groupBy: SearchResultGroupType
    orderBy: SearchOrderType
    fetchResult: (query: string) => Promise<void>
    result: any
  }
}
export default Vue.extend({
  components: {
    CalendarIcon,
  },
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      groupList: SearchUtil.getSearchResultGroupList(),
      orderTypeList: SearchUtil.getSearchOrderTypeList(),
      query: '',
      groupBy: SearchResultGroupType.Messages,
      orderBy: SearchOrderType.New,
      users: [],
      channels: [],
      date: null,
      page: 0,
      result: {} as any,
    }
  },
  computed: {
    /**
     * @method DataStateType DocsTODO
     * @description
     * @returns
     */
    DataStateType: () => DataStateType,
    ...mapState(['dataState', 'search']),
    loading: {
      set(state: DataStateType) {
        this.$store.commit('dataState/setDataState', {
          key: 'search',
          value: state,
        })
      },
      get() {
        return this.dataState.search
      },
    },
    /**
     * @method userOptions DocsTODO
     * @description
     * @returns
     */
    userOptions() {
      return this.result &&
        this.result.recommends &&
        this.result.recommends.users &&
        this.result.recommends.users.length > 0
        ? this.result.recommends.users
        : []
    },
    /**
     * @method channelOptions DocsTODO
     * @description
     * @returns
     */
    channelOptions() {
      return this.result &&
        this.result.recommends &&
        this.result.recommends.channels &&
        this.result.recommends.channels.length > 0
        ? this.result.recommends.channels
        : []
    },
    /**
     * @method givenQueryItems DocsTODO
     * @description
     * @returns
     */
    givenQueryItems() {
      return this.search.query.split(' ')
    },
  },
  watch: {
    /**
     * @method saerchQuery DocsTODO
     * @description
     * @param
     * @returns
     */
    searchQuery(query) {
      if (!this.show || query !== this.searchQuery) {
        return
      }
      this.fetchResult(query)
    },
  },
  methods: {
    /**
     * @method toggle DocsTODO
     * @description
     */
    toggle() {
      this.$emit('toggle')
    },
    /**
     * @method toggleGroupBy DocsTODO
     * @description
     * @param state
     */
    toggleGroupBy(state: SearchResultGroupType) {
      this.groupBy = state
    },
    /**
     * @method toggleOrderBy DocsTODO
     * @description
     * @param state
     */
    toggleOrderBy(state: SearchOrderType) {
      this.orderBy = state
    },
    /**
     * @method fetchResult DocsTODO
     * @description
     * @param query
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async fetchResult(query: string): Promise<void> {
      this.loading = DataStateType.Loading
      await new Promise((resolve) => setTimeout(resolve, 3000))
      this.result = searchResult
      this.loading = DataStateType.Ready
    },
  },
})
</script>
<style global lang="less" src="./ResultGlobal.less"></style>
<style scoped lang="less" src="./Result.less"></style>
