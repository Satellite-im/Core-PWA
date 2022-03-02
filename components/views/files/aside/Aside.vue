<template src="./Aside.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      progress: this.$FileSystem.percentStorageUsed as number,
    }
  },
  computed: {
    totalSize(): string {
      return this.$filesize(this.$FileSystem.totalSize)
    },
    sizeLimit(): string {
      return this.$filesize(this.$Config.personalFilesLimit)
    },
    sizeColor(): string {
      return this.progress > 90 ? 'red' : 'green'
    },
  },
  watch: {
    totalSize() {
      this.progress = this.$FileSystem.percentStorageUsed
    },
  },
})
</script>
<style scoped lang="less" src="./Aside.less"></style>
