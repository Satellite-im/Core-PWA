<template src="./Friend.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { Friend } from '~/types/ui/core'

export default Vue.extend({
  props: {
    friend: {
      type: Object as PropType<Friend>,
      default: () => {},
    },
    request: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
