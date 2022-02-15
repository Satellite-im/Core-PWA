<template src="./Filepath.html"></template>
<script lang="ts">
import Vue from 'vue'
import { HomeIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    HomeIcon,
  },
  // data() {
  //   return {
  //     fileSystem: this.$FileSystem,
  //   }
  // },
  computed: {
    // don't include root, use home icon for that
    path(): string[] {
      return this.$FileSystem.currentDirectoryPath?.slice(1) ?? []
    },
  },
  methods: {
    goBackToDirectory(dir: string) {
      this.$FileSystem.goBackToDirectory(dir)
    },
  },
})
</script>
<style scoped lang="less" src="./Filepath.less"></style>
