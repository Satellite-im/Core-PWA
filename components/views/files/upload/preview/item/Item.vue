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
  data: () => ({
    url: '',
  }),

  computed: {
    ...mapState({
      blockNsfw: (state) => (state as RootState).textile.userThread.blockNsfw,
    }),
  },
  mounted() {
    if (this.item.thumbnail) {
      this.url = URL.createObjectURL(this.item.thumbnail)
    }
  },
  beforeDestroy() {
    URL.revokeObjectURL(this.url)
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
