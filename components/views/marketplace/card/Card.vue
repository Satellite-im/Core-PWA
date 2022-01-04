<template src="./Card.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { HeartIcon, TagIcon } from 'satellite-lucide-icons'

import { ProductItem } from '~/types/marketplace/marketplace'
export default Vue.extend({
  components: {
    HeartIcon,
    TagIcon,
  },
  props: {
    product: {
      type: Object as PropType<ProductItem>,
      default: null as ProductItem | null,
    },
  },
})
</script>

<style scoped lang="less" src="./Card.less"></style>
