<template src="./Meta.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { TranslateResult } from 'vue-i18n'
import { SearchOrderType, UISearchResult } from '~/types/search/search'

export default Vue.extend({
  props: {
    items: {
      type: Array,
      required: true,
    },
    result: {
      type: Object as PropType<UISearchResult>,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
    orderBy: {
      type: String as PropType<SearchOrderType>,
      required: true,
    },
  },
  computed: {
    resultsText(): TranslateResult {
      // if 0 results
      if (this.result.totalRows === 0) {
        return this.$t('search.result.no_results')
      }
      // if 1 result
      if (this.result.totalRows === 1) {
        return this.$t('search.result.one_result')
      }
      // if > 1, but less than perPage
      if (this.result.totalRows <= this.perPage) {
        return this.$t('search.result.one_page', [this.result.totalRows])
      }
      // if last page of multipage results with only 1 result
      if (this.result.data.length === 1) {
        return this.$t('search.result.one_result_last_page', {
          resultNum: (this.page - 1) * this.perPage + 1,
          total: this.result.totalRows,
        })
      }
      // regular multipage result
      return this.$t('search.result.multi_page', {
        pageStart: (this.page - 1) * this.perPage + 1,
        pageEnd: Math.min(this.page * this.perPage, this.result.totalRows),
        total: this.result.totalRows,
      })
    },
  },
})
</script>
<style scoped lang="less" src="./Meta.less"></style>
