<template src="./SimpleList.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SimpleList } from '~/types/ui/sidebar'

export default Vue.extend({
  props: {
    /**
     * Set the active route
     */
    active: {
      type: String,
      default: '',
    },
    /**
     * List of sidebar content
     */
    menuContent: {
      type: Array as PropType<SimpleList>,
      default: () => [],
    },
  },
})
</script>

<style scoped lang="less" src="./SimpleList.less"></style>
