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
    cancelUpload: {
      type: Function,
      default: () => {},
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
      this.$props.cancelUpload()
    },
    removeUploadItem(index: number) {
      if (this.$props.files.length === 1) {
        document.body.style.cursor = PropCommonEnum.DEFAULT
        this.$store.commit('chat/setCountError', false)
        this.$store.commit('chat/setShowFilePreview', false)
        this.$store.commit('chat/deleteFiles', this.$props.recipient.address)
        this.$store.dispatch('textile/clearUploadStatus')
        if (this.$store.state.textile.messageLoading)
          this.$store.commit('textile/setMessageLoading', { loading: false })
      }

      this.$store.commit('chat/setFiles', {
        files: this.$props.files.filter(
          (file: UploadDropItemType, i: number) => i !== index,
        ),
        address: this.$props.recipient.address,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./FilePreview.less"></style>
