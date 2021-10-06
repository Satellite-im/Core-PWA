<template src="./Nav.html"></template>
<script lang="ts">
import Vue from 'vue'

import {
  UserIcon,
  UserCheckIcon,
  UserPlusIcon,
  UserXIcon,
  // @ts-ignore
} from 'vue-feather-icons'

export default Vue.extend({
  components: {
    UserIcon,
    UserCheckIcon,
    UserPlusIcon,
    UserXIcon,
  },
  props: {
    setRoute: {
      type: Function,
      default: () => () => {},
    },
    route: {
      type: String,
      default: 'active',
    },
  },
})
</script>
<style scoped lang="less" src="./Nav.less"></style>
