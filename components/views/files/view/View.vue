<template src="./View.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import {
  FileIcon,
  DownloadIcon,
  SlashIcon,
  ArchiveIcon,
  XIcon,
  LinkIcon,
} from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    FileIcon,
    DownloadIcon,
    SlashIcon,
    ArchiveIcon,
    XIcon,
    LinkIcon,
  },
  computed: {
    ...mapState({
      file: (state) => (state as RootState).ui.filePreview,
      fileDownloadList: (state) => (state as RootState).ui.fileDownloadList,
      blockNsfw: (state) => (state as RootState).textile.userThread.blockNsfw,
    }),
    ...mapGetters('ui', ['isFilesIndexLoading']),
    isDownloading(): boolean {
      return this.file?.name
        ? this.fileDownloadList.includes(this.file.name)
        : false
    },
  },
  methods: {
    /**
     * @method download
     * @description download file using stream saver, apply original extension if it was removed
     * add name to store so the user doesn't start another download of the same file
     * also takes a bit to get started for large files, this adds loading indicator
     */
    async download() {
      if (this.file) {
        this.$store.commit('ui/addFileDownload', this.file.name)
        const fileExt = this.file.name
          .slice(((this.file.name.lastIndexOf('.') - 1) >>> 0) + 2)
          .toLowerCase()

        await this.$TextileManager.bucket?.pullFileStream(
          this.file.id,
          this.file.extension === fileExt
            ? this.file.name
            : (this.file.name += `.${this.file.extension}`),
          this.file.size,
        )
        this.$store.commit('ui/removeFileDownload', this.file.name)
      }
    },
    /**
     * @method share
     * @description Emit to share item - pages/files/browse/index.vue
     */
    share() {
      this.$emit('share', this.file)
    },
  },
})
</script>
<style scoped lang="less" src="./View.less"></style>
