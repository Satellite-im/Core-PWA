<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { FileIcon, XIcon } from 'satellite-lucide-icons'
import { ChatFileUpload } from '~/store/chat/types'
import { RootState } from '~/types/store/store'

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
  computed: {
    ...mapState({
      blockNsfw: (state) => (state as RootState).textile.userThread.blockNsfw,
    }),
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
