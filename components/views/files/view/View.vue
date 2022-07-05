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
import iridium from '~/libraries/Iridium/IridiumManager'

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
  mounted() {
    if (this.$refs.modal) (this.$refs.modal as HTMLElement).focus()
  },
  methods: {
    /**
     * @method download
     * @description download file using stream saver, apply original extension if it was removed
     * add name to store so the user doesn't start another download of the same file
     * also takes a bit to get started for large files, this adds loading indicator
     */
    async download() {
      // assign variable in case the user closes modal and removes store value before download is finished
      const file = this.file
      if (file) {
        this.$store.commit('ui/addFileDownload', file.name)
        await iridium.files?.download(file)
        this.$store.commit('ui/removeFileDownload', file.name)
      }
    },
    /**
     * @method share
     * @description copy link to clipboard
     */
    // async share() {
    //   this.$toast.show(this.$t('todo - share') as string)
    // },
    /**
     * @method closeFilePreview
     * @description Close File Preview
     * @example
     */
    close() {
      this.$store.commit('ui/setFilePreview', undefined)
    },
  },
})
</script>
<style scoped lang="less" src="./View.less"></style>
