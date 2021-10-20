<template src="./Recommended.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { HeartIcon, ShoppingCartIcon } from 'satellite-lucide-icons'
import { GlyphShopItem } from '~/types/marketplace/marketplace'
import { GlyphMarketViewStatus } from '~/store/ui/types'

export default Vue.extend({
  components: {
    HeartIcon,
    ShoppingCartIcon,
  },
  props: {
    item: {
      type: Object as PropType<GlyphShopItem>,
      default: null,
    },
  },
  methods: {
    goToShopItem() {
      this.$store.commit('setGlyphMarketplaceView', {
        view: GlyphMarketViewStatus.SHOP_DETAIL,
        shopId: this.item.id,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Recommended.less"></style>
