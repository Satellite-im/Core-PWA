<template src="./Grid.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'

export default Vue.extend({
  props: {
    /**
     * Directory items to be displayed
     */
    directory: {
      type: Array as PropType<Array<Item>>,
      default: () => [],
    },
    /**
     * counter to force reactivity for Map
     */
    counter: {
      type: Number,
      required: true,
    },
  },
  methods: {
    /**
     * @method handle
     * @description Emit item to be handled in pages/files/browse/index.vue
     */
    handle(item: Item) {
      this.$emit('handle', item)
    },
    /**
     * @method forceRender
     * @description force reactivity for Map
     */
    forceRender() {
      this.$emit('forceRender')
    },
  },
})
</script>
<style scoped lang="less" src="./Grid.less"></style>
