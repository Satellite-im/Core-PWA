<template src="./SimpleList.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { MenuIcon } from 'satellite-lucide-icons'

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
      required: true,
    },
  },
})
</script>

<style scoped lang="less" src="./SimpleList.less"></style>
