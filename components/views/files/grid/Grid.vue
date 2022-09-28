<template src="./Grid.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { IridiumItem } from '~/libraries/Iridium/files/types'

export default Vue.extend({
  props: {
    /**
     * Directory items to be displayed
     */
    directory: {
      type: Array as PropType<Array<IridiumItem>>,
      required: true,
    },
  },
})
</script>
<style scoped lang="less" src="./Grid.less"></style>
