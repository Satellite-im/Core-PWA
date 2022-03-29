<template src="./Meta.html"></template>
<script lang="ts">
import { SearchResult } from 'minisearch'
import Vue, { PropType } from 'vue'
import { SearchOrderType } from '~/types/search/search'

export default Vue.extend({
  props: {
    items: {
      type: Array,
      required: true,
    },
    result: {
      type: Array as PropType<Array<SearchResult>>,
      required: true,
    },
    orderBy: {
      type: String as PropType<SearchOrderType>,
      required: true,
    },
  },
})
</script>
<style scoped lang="less" src="./Meta.less"></style>
