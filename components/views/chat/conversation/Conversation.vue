<template src="./Conversation.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import { MessageGroup } from '~/types/messaging'

export default Vue.extend({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    messages: {
      type: Array as PropType<MessageGroup>,
      default: () => [],
    },
    groupId: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState(['ui', 'textile']),
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
