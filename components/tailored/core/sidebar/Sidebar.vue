<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { User } from '~/types/ui/core'

export default Vue.extend({
  props: {
    toggle: {
      type: Function,
      default: () => {},
    },
    users: {
      type: Array as PropType<Array<User>>,
      // @ts-ignore
      default: () => [],
    },
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
