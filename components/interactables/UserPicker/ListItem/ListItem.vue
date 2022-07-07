<template src="./ListItem.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Friend } from '~/types/ui/friends'

export default Vue.extend({
  name: 'ListItem',
  props: {
    friend: {
      type: Object as PropType<Friend>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    src(): string {
      const hash =
        this.friend?.photoHash ||
        this.friend?.profilePicture ||
        this.friend?.request?.userInfo?.photoHash
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
})
</script>

<style scoped lang="less" src="./ListItem.less"></style>
