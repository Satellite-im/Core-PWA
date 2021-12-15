<template src="./GroupIcon.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Group } from '~/types/ui/core'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      default: () => ({
        name: '',
        address: '',
        motd: '',
      }),
      required: true,
    },
  },
  data() {
    return {}
  },
})
</script>

<style scoped lang="less" src="./GroupIcon.less"></style>
