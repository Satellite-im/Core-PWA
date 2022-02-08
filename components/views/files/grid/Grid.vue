<template src="./Grid.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'

export default Vue.extend({
  props: {
    directory: {
      type: Array as PropType<Array<Item>>,
      default: () => [],
    },
  },
  methods: {
    /**
     * @method handle DocsTODO
     * @description
     * @param item
     * @returns
     * @example
     */
    handle(item: Item) {
      this.$emit('handle', item)
    },
  },
})
</script>
<style scoped lang="less" src="./Grid.less"></style>
