<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { HeartIcon, ShoppingCartIcon } from 'satellite-lucide-icons'
import { GlyphShopItem } from '~/types/marketplace/marketplace'

export default Vue.extend({
  components: {
    HeartIcon,
    ShoppingCartIcon,
  },
  props: {
    item: {
      type: Object as PropType<GlyphShopItem>,
      default: () => {},
    },
  },
  data() {},
})
</script>

<style scoped lang="less" src="./Item.less"></style>
