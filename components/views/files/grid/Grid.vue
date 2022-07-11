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
     * @method like
     * @description Emit to like item - pages/files/browse/index.vue
     */
    like(item: Item) {
      this.$emit('like', item)
    },
    /**
     * @method share
     * @description Emit to share item - pages/files/browse/index.vue
     */
    share(item: Item) {
      this.$emit('share', item)
    },
    /**
     * @method remove
     * @description Emit to delete item - pages/files/browse/index.vue
     */
    remove(item: Item) {
      this.$emit('remove', item)
    },
  },
})
</script>
<style scoped lang="less" src="./Grid.less"></style>
