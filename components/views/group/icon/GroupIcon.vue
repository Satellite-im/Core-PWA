<template src="./GroupIcon.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Group, GroupMember } from '~/store/groups/types'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    getSource(member: GroupMember) {
      return member?.photoHash
        ? `${this.$Config.textile.browser}/ipfs/${member.photoHash}`
        : ''
    },
  },
})
</script>

<style scoped lang="less" src="./GroupIcon.less"></style>
