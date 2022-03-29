<template src="./Result.html"></template>

<script lang="ts">
import Vue from 'vue'
import VuejsPaginate from 'vuejs-paginate'
import { CalendarIcon } from 'satellite-lucide-icons'
import { mapState } from 'vuex'
import SearchUtil from '~/components/views/chat/search/SearchUtil'
import {
  SearchOrderType,
  SearchResultGroupType,
  QueryOptions,
  SearchResult,
} from '~/types/search/search'
import { DataStateType } from '~/store/dataState/types'

Vue.component('Paginate', VuejsPaginate)

export default Vue.extend({
  components: {
    CalendarIcon,
  },
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      groupList: SearchUtil.getSearchResultGroupList(),
      orderTypeList: SearchUtil.getSearchOrderTypeList(),
      query: '' as string,
      groupBy: SearchResultGroupType.Messages as SearchResultGroupType,
      orderBy: SearchOrderType.New as SearchOrderType,
      channels: [],
      date: null,
      page: 1 as number,
      perPage: 10 as number,
      result: [] as SearchResult[],
      queryOptions: {
        queryString: '',
        accounts: [],
        dateRange: null,
      } as QueryOptions,
    }
  },
  computed: {
    ...mapState(['dataState', 'friends', 'accounts']),
    DataStateType: () => DataStateType,
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
    currPageResults(): SearchResult[] {
      return this.$data.result.slice(
        (this.$data.page - 1) * this.$data.perPage,
        this.$data.page * this.$data.perPage,
      )
    },

    // disabled functionality, will be refactored later
    // userOptions() {
    //   return this.result?.recommends?.users?.length
    //     ? this.result.recommends.users
    //     : []
    // },
    // channelOptions() {
    //   return this.result?.recommends?.channels?.length
    //     ? this.result.recommends.channels
    //     : []
    // },
    // givenQueryItems() {
    //   return this.searchQuery.split(' ')
    // },
  },
  watch: {
    date: {
      handler(newDateValue) {
        this.$data.queryOptions = {
          ...this.$data.queryOptions,
          dateRange: {
            start: newDateValue,
            end: newDateValue,
          },
        }
      },
    },
  },
  mounted() {
    this.fetchResult(this.searchQuery)
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
    async fetchResult(query: string): Promise<void> {
      this.$data.loading = DataStateType.Loading
      this.$data.queryOptions = {
        ...this.$data.queryOptions,
        accounts: [...this.friends.all, this.accounts.details],
        queryString: query,
      }
      this.$data.result = await this.$store.dispatch(
        'textile/searchConversations',
        {
          query: this.$data.queryOptions,
          page: this.$data.page,
        },
      )
      this.$data.loading = DataStateType.Ready
    },
    handleClickPaginate(pageNum: number) {
      this.$data.page = pageNum
    },
    onChange(value: any) {
      this.$data.queryOptions = {
        ...this.$data.queryOptions,
        accounts: value,
      }
    },
  },
})
</script>
<style global lang="less" src="./ResultGlobal.less"></style>
<style scoped lang="less" src="./Result.less"></style>
