<template src="./Attachments.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { MessageAttachment } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  props: {
    attachments: {
      type: [] as PropType<MessageAttachment>,
      required: true,
    },
  },
})
</script>

<style scoped lang="less" src="./Attachments.less"></style>
