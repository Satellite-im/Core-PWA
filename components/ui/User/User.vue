<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ZapIcon, CircleIcon } from 'satellite-lucide-icons'

import { User } from '~/types/ui/user'

export default Vue.extend({
  components: {
    ZapIcon,
    CircleIcon,
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
