<template src="./Result.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import VuejsPaginate from 'vuejs-paginate'
import { CalendarIcon } from 'satellite-lucide-icons'
import SearchUtil from '~/components/views/chat/search/SearchUtil'
import {
  SearchOrderType,
  SearchResultGroupType,
  QueryOptions,
  UISearchResult,
  MatchTypesEnum,
} from '~/types/search/search'

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
      query: '' as string,
      groupBy: SearchResultGroupType.Messages as SearchResultGroupType,
      orderBy: SearchOrderType.New as SearchOrderType,
      channels: [],
      date: null,
      result: [] as UISearchResult[],
      page: 1 as number,
      queryOptions: {
        queryString: '',
        accounts: [],
        dateRange: null,
        perPage: 10,
      } as QueryOptions,
    }
  },
  computed: {
    ...mapState(['friends', 'accounts']),
    ...mapGetters('conversation', ['otherParticipants']),
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
      handler(newValue) {
        this.queryOptions = {
          ...this.queryOptions,
          dateRange: {
            start: newValue,
            end: newValue,
          },
        }
      },
    },
  },
  mounted() {
    this.fetchResult()
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
      this.fetchResult()
    },
    /**
     * @method fetchResult DocsTODO
     * @description
     * @param query
     */
    async fetchResult(): Promise<void> {
      this.isLoading = true
      this.queryOptions = {
        ...this.queryOptions,
        accounts: [...this.otherParticipants, this.accounts.details],
        queryString: this.searchQuery,
      }
      this.isLoading = false
    },
    async handleClickPaginate(pageNum: number) {
      this.page = pageNum
      await this.fetchResult()
    },
    onChange(value: any) {
      this.queryOptions = {
        ...this.queryOptions,
        accounts: value,
      }
    },
  },
})
</script>
<style global lang="less" src="./ResultGlobal.less"></style>
<style scoped lang="less" src="./Result.less"></style>
