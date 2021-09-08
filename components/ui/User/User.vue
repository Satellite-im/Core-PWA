<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/core'

export default Vue.extend({
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => ({
        name: '',
        address: '',
        status: '',
      }),
      required: true,
    },
    creatorBadge: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
