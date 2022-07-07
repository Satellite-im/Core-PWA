<template src="./Filepath.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { HomeIcon } from 'satellite-lucide-icons'
import fileSystem from '~/libraries/Files/FilSystem'

export default Vue.extend({
  components: {
    HomeIcon,
  },
  computed: {
    ...mapGetters('ui', ['isFilesIndexLoading']),
    /**
     * @returns string array of file paths to current directory (not including root)
     */
    path(): string[] {
      return fileSystem.currentDirectoryPath?.slice(1) ?? []
    },
  },
  methods: {
    /**
     * @method goBackToDirectory
     * @description Navigate to specific directory in file system
     * @param string directory name
     */
    goBackToDirectory(dir: string) {
      fileSystem.goBackToDirectory(dir)
    },
  },
})
</script>
<style scoped lang="less" src="./Filepath.less"></style>
