<template src="./Filepath.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { HomeIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    HomeIcon,
  },
  computed: {
    ...mapState(['bucket']),
    // don't include root, use home icon for that
    path(): string[] {
      return this.bucket.fileSystem?.currentDirectoryPath?.slice(1) ?? []
    },
  },
  methods: {
    goBackToDirectory(dir: string) {
      this.$store.commit('bucket/goBackToDirectory', dir)
    },
  },
})
</script>
<style scoped lang="less" src="./Filepath.less"></style>
