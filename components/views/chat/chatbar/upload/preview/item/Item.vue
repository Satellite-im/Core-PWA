<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { FileIcon, XIcon } from 'satellite-lucide-icons'
import { ChatFileUpload } from '~/store/chat/types'

export default Vue.extend({
  components: {
    FileIcon,
    XIcon,
  },
  props: {
    item: {
      type: Object as PropType<ChatFileUpload>,
      required: true,
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
