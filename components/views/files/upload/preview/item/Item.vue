<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import {
  FileIcon,
  FilePlusIcon,
  SlashIcon,
  XIcon,
} from 'satellite-lucide-icons'
import { ChatFileUpload } from '~/store/chat/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    FileIcon,
    FilePlusIcon,
    SlashIcon,
    XIcon,
  },
  props: {
    item: {
      type: Object as PropType<ChatFileUpload>,
      required: true,
    },
  },
  computed: {
    ...mapState({
      uploadProgress: (state) => (state as RootState).chat.uploadProgress,
    }),
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
