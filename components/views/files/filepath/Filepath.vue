<template src="./Filepath.html"></template>
<script lang="ts">
import Vue from 'vue'

import { HomeIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    HomeIcon,
  },
  data() {
    return {
      // needs this for breadcrumbs to work
      fileSystem: this.$Bucket.fileSystem,
    }
  },
  computed: {
    // don't include root, use home icon for that
    path(): string[] {
      return this.$Bucket.fileSystem.currentDirectoryPath.slice(1)
    },
  },
  methods: {
    jumpTo(dir: string) {
      this.$Bucket.fileSystem.goBackToDirectory(dir)
    },
  },
})
</script>
<style scoped lang="less" src="./Filepath.less"></style>
