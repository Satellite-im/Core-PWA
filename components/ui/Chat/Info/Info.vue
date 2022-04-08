<template src="./Info.html" />
<script lang="ts">
import Vue, { PropType } from 'vue'
import { InfoType } from './types.d'

export default Vue.extend({
  props: {
    caption: {
      type: String,
      default: '',
    },
    type: {
      type: String as PropType<InfoType>,
      default: 'primary',
    },
    clickHandler: {
      type: Function,
      default: () => {},
    },
  },
})
</script>
<style scoped lang="less" src="./Info.less"></style>
