<template src="./Nav.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  UserIcon,
  UserCheckIcon,
  UserPlusIcon,
  UserXIcon,
} from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    UserIcon,
    UserCheckIcon,
    UserPlusIcon,
    UserXIcon,
  },
  computed: {
    ...mapState(['friends']),
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
