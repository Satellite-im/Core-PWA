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
      dataURL: '',
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
    downloadName(): string {
      if (!this.file) {
        return ''
      }
      const fileExt = this.file.name
        .slice(((this.file.name.lastIndexOf('.') - 1) >>> 0) + 2)
        .toLowerCase()
      return this.file.extension === fileExt
        ? this.file.name
        : `${this.file.name}.${this.file.extension}`
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
        const anchor = this.$refs.download as HTMLAnchorElement
        const { fileBuffer } = await iridium.connector?.load(file.id)
        this.dataURL = URL.createObjectURL(
          new Blob([fileBuffer], { type: file.type }),
        )
        anchor.href = this.dataURL
        anchor.click()
        URL.revokeObjectURL(this.dataURL)
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
