<template src="./Friend.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  XIcon,
  CheckIcon,
  MoreVerticalIcon,
  MessageSquareIcon,
  CircleIcon,
  SmartphoneIcon,
} from 'satellite-lucide-icons'

import { Friend } from '~/types/ui/friends'

export default Vue.extend({
  components: {
    XIcon,
    CheckIcon,
    MoreVerticalIcon,
    MessageSquareIcon,
    CircleIcon,
    SmartphoneIcon,
  },
  props: {
    friend: {
      type: Object as PropType<Friend>,
      default: () => {},
    },
    request: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
