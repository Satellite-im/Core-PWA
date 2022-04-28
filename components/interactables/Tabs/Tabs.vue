<template src="./Tabs.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { Tab } from '~/types/ui/tab'

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
  methods: {
    setRoute(route: string) {
      this.$emit('setRoute', route)
    },
  },
})
</script>
<style scoped lang="less" src="./Tabs.less"></style>
