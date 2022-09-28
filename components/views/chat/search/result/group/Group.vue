<template src="./Group.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { SearchResultGroupType } from '~/types/search/search'

export default Vue.extend({
  props: {
    groupList: {
      type: Array,
      required: true,
    },
    groupBy: {
      type: String as PropType<SearchResultGroupType>,
      required: true,
    },
  },
})
</script>
<style scoped lang="less" src="./Group.less"></style>
