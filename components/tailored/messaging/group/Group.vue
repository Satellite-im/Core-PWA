<template src="./Group.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { Group } from '~/types/messaging'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      default: () => {},
    },
  },
  methods: {
    showQuickProfile(e: Event) {
      this.$store.commit('setQuickProfilePosition', e)
      this.$store.commit('quickProfile', true)
    },
  },
})
</script>
<style scoped lang="less" src="./Group.less"></style>
