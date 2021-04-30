<template src="./Title.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { HeadingSize } from '~/types/ui/typography'

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: 'Missing prop `text`.',
    },
    size: {
      type: Number as PropType<HeadingSize>,
      default: 1,
    },
  },
})
</script>
<style scoped lang="less" src="./Title.less"></style>
