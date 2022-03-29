<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SearchResultItem } from '~/types/search/search'

declare module 'vue/types/vue' {
  interface Vue {}
}
export default Vue.extend({
  props: {
    data: {
      type: Object as PropType<SearchResultItem>,
      required: true,
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less" />
