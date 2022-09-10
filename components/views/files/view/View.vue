<template src="./View.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
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
  data() {
    return {
      thumbnail: '',
    }
  },
  computed: {
    ...mapState({
      file: (state) => (state as RootState).files.preview,
      downloadList: (state) => (state as RootState).files.downloadList,
    }),
    isDownloading(): boolean {
      return this.file?.name
        ? this.downloadList.includes(this.file.name)
        : false
    },
  },
  async mounted() {
    if (this.$refs.modal) (this.$refs.modal as HTMLElement).focus()

    if (this.file?.thumbnail) {
      this.thumbnail = URL.createObjectURL(
        await iridium.files.fetchThumbnail(this.file.thumbnail, this.file.type),
      )
    }
  },
  beforeDestroy() {
    if (this.thumbnail) URL.revokeObjectURL(this.thumbnail)
  },
  methods: {
    /**
     * @method download
     * @description download file using stream saver, apply original extension if it was removed
     * add name to store so the user doesn't start another download of the same file
     */
    async download() {
      // assign variable in case the user closes modal and removes store value before download is finished
      const file = this.file
      if (file) {
        this.$store.commit('files/addDownload', file.name)
        const fileExt = file.name
          .slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
          .toLowerCase()

        await iridium.files.download(
          file.id,
          file.extension === fileExt
            ? file.name
            : `${file.name}.${file.extension}`,
          file.size,
        )
        this.$store.commit('files/removeDownload', file.name)
      }
    },
    share() {
      this.$toast.show(this.$t('todo - share') as string)
    },
    close() {
      this.$store.commit('files/setPreview', undefined)
    },
  },
})
</script>
<style scoped lang="less" src="./View.less"></style>
