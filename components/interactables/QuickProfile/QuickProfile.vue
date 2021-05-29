<template src="./QuickProfile.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/core'

export default Vue.extend({
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => {},
    },
  },
  methods: {
    close() {
      this.$store.commit('quickProfile', false)
    },
  },
})
</script>
<style scoped lang="less" src="./QuickProfile.less"></style>
