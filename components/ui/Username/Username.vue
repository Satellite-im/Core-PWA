<template src="./Username.html"></template>
<script lang="ts">
import Vue from 'vue'
import { Config } from '~/config'

export default Vue.extend({
  props: {
    username: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      badgeIcon: this.badge
        ? {
            // @ts-ignore
            style: Config.badges[this.badge]?.[0],
            // @ts-ignore
            name: Config.badges[this.badge]?.[1],
          }
        : undefined,
    }
  },
})
</script>
<style scoped lang="less" src="./Username.less"></style>
