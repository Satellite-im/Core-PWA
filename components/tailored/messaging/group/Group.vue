<template src="./Group.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { Group } from '~/types/messaging'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      default: () => {},
    },
  },
})
</script>
<style scoped lang="less" src="./Group.less"></style>
