<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

// @ts-ignore
import { ZapIcon } from 'vue-feather-icons'

import { User } from '~/types/ui/user'

export default Vue.extend({
  components: {
    ZapIcon,
  },
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
