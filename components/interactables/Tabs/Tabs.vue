<template src="./Tabs.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { Tab } from './types.d'

export default Vue.extend({
  props: {
    route: {
      type: String,
      default: '',
    },
    tabs: {
      type: Array as PropType<Array<Tab>>,
      required: true,
    },
  },
  data() {
    return {
      active: false,
    }
  },
  methods: {
    setRoute(route: string) {
      this.$emit('setRoute', route)
    },
  },
})
</script>
<style scoped lang="less" src="./Tabs.less"></style>
