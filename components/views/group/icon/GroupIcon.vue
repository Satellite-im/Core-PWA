<template src="./GroupIcon.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Group } from '~/store/groups/types'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      default: () => ({
        name: '',
        address: '',
        motd: '',
        members: '',
        membersInfo: [],
      }),
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    getSlicedMembers() {
      if (this.group.membersInfo) {
        return this.group.membersInfo.slice(0, 3)
      }
      return this.group
    },
  },
})
</script>

<style scoped lang="less" src="./GroupIcon.less"></style>
