<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'

import { FolderPlusIcon, FilePlusIcon } from 'satellite-lucide-icons'
import { FilesViewEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  components: {
    FolderPlusIcon,
    FilePlusIcon,
  },
  props: {
    changeView: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      text: '' as string,
      input: { show: false as boolean, type: '' as FilesViewEnum },
    }
  },
  computed: {
    FilesViewEnum: () => FilesViewEnum,
  },
  methods: {
    toggleInput(type: FilesViewEnum) {
      if (!this.input.show) {
        this.input.show = true
        this.input.type = type
        return
      }
      if (type !== this.input.type) {
        this.input.type = type
        return
      }
      this.input.show = !this.input.show
    },
    addItem() {
      if (!this.text) {
        return
      }
      if (this.input.type === FilesViewEnum.FOLDER) {
        this.$Bucket.fileSystem.createDirectory(this.text)
        this.input.show = false
        return
      }
      // add file
      this.input.show = false
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
