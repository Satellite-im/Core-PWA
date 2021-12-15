<template src="./Trending.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Glyph } from '~/types/ui/glyph'

export default Vue.extend({
  props: {
    list: {
      type: Object as PropType<Glyph>,
      default: () => {},
    },
  },
})
</script>

<style scoped lang="less" src="./Trending.less"></style>
