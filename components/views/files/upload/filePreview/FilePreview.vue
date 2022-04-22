<template src="./FilePreview.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { XIcon } from 'satellite-lucide-icons'
import { PropCommonEnum } from '~/libraries/Enums/enums'

import { Friend } from '~/types/ui/friends'
import { UploadDropItemType } from '~/types/files/file'

export default Vue.extend({
  components: {
    XIcon,
  },
  props: {
    recipient: {
      type: Object as PropType<Friend>,
      default: null,
    },
    files: {
      type: Array as PropType<UploadDropItemType[]>,
      default: null,
    },
  },
  computed: {
    countError() {
      return this.$store.state.chat.countError
    },
    alertNsfw() {
      return this.$store.state.chat.alertNsfw
    },
  },
  methods: {
    handleTouchPreview(event: Event) {
      event.stopPropagation()
    },
    closeNsfwAlert() {
      this.$store.commit('chat/setAlertNsfw', false)
      this.$emit('cancelUpload')
    },
    removeUploadItem(index: number) {
      this.$store.dispatch('chat/removeUploadItem', {
        itemIndex: index,
        files: this.$props.files,
        recipientAddress: this.$props.recipient.address,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./FilePreview.less"></style>
