<template src="./View.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { FileType } from '~/types/files/file'

export default Vue.extend({
  props: {
    file: {
      type: Object as PropType<FileType>,
      default: () => {},
    },
  },
})
</script>
<style scoped lang="less" src="./View.less"></style>
