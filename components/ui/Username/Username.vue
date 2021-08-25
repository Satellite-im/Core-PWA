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
            style: this.getBadge(this.badge)?.[0],
            name: this.getBadge(this.badge)?.[1],
          }
        : undefined,
    }
  },
  methods: {
    getBadge(icon: Array<String>) {
      return Config.badges[icon].icon
    },
  },
})
</script>
<style scoped lang="less" src="./Username.less"></style>
