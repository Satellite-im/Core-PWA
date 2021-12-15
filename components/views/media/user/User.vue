<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/user'

export default Vue.extend({
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => {},
    },
    talking: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
