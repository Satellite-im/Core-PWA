<template src="./Aside.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      progress: 0 as number,
    }
  },
  computed: {
    totalSize(): string {
      return this.$filesize(this.$FileSystem.totalSize)
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
