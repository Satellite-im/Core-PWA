<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { mobileSwipe } from '../../../../components/mixins/Swipe/Swipe'
import { User, Group } from '~/types/ui/core'

export default Vue.extend({
  mixins: [mobileSwipe],
  props: {
    toggle: {
      type: Function,
      default: () => {},
    },
    users: {
      type: Array as PropType<Array<User>>,
      default: () => [],
    },
    groups: {
      type: Array as PropType<Array<Group>>,
      default: () => [],
    },
  },
  data() {
    return {
      showUsers: false,
    }
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
