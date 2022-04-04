<template src="./FilePreview.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { PropCommonEnum } from '~/libraries/Enums/enums'

import { Friend } from '~/types/ui/friends'
import { UploadDropItemType } from '~/types/files/file'

export default Vue.extend({
  components: {},
  props: {
    recipient: {
      type: Object as PropType<Friend>,
      default: null,
    },
    files: {
      type: Array as PropType<UploadDropItemType[]>,
      default: null,
    },
    countError: {
      type: Boolean,
      default: false,
    },
    uploadStatus: {
      type: Boolean,
      default: false,
    },
    cancelUpload: {
      type: Function,
      default: () => {},
    },
    alertNsfw: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {
    handleTouchPreview(event: Event) {
      event.stopPropagation()
    },
    closeNsfwAlert() {
      this.$props.alertNsfw = false
      this.$props.cancelUpload()
    },
    removeUploadItem(index: number) {
      this.$props.files.splice(index, 1)
      if (this.$props.files.length === 0) {
        document.body.style.cursor = PropCommonEnum.DEFAULT
        this.$props.uploadStatus = false
        this.$props.countError = false
        this.$parent.$data.showFilePreview = false
        this.$store.commit('chat/deleteFiles', this.$props.recipient.address)
        this.$store.dispatch('textile/clearUploadStatus')
        if (this.$store.state.textile.messageLoading)
          this.$store.commit('textile/setMessageLoading', { loading: false })
        return
      }
      this.$store.commit('chat/setFiles', {
        files: this.$props.files,
        address: this.$props.recipient.address,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./FilePreview.less"></style>
