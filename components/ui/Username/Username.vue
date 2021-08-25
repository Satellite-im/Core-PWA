<template src="./Username.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import badges from '~/config/badges'

import { Badge } from '@/types/ui/core'

export default Vue.extend({
  props: {
    username: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      badgeIcon: this.badge
        ? {
            style: badges[this.badge]?.[0],
            name: badges[this.badge]?.[1],
          }
        : undefined,
    }
  },
})
</script>
<style scoped lang="less" src="./Username.less"></style>
