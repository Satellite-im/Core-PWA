<template src="./SimpleList.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

// @ts-ignore
import { MenuIcon } from 'vue-feather-icons'

import { SimpleList } from '~/types/ui/sidebar'

export default Vue.extend({
  components: {
    MenuIcon,
  },
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
