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
import { filetypeextension } from 'magic-bytes.js'
import { Fil } from '~/libraries/Files/Fil'

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
      file: undefined as Fil | undefined,
      name: '' as string,
      progress: 0 as number,
    }
  },
  computed: {
    ...mapState(['ui']),
    isLoading(): boolean {
      return this.progress >= 0 && this.progress < 100
    },
  },
  /**
   */
  async created() {
    this.file = this.$FileSystem.getChild(this.ui.filePreview) as Fil
    this.name = this.file?.name

    // if no file data available, pull encrypted file from textile bucket
    if (!this.file.file) {
      const fsFil: Fil = this.$FileSystem.getChild(this.file.name) as Fil
      fsFil.file = await this.$TextileManager.bucket?.pullFile(
        this.file.id,
        this.file.name,
        this.file.type,
        this.file.size,
        this.setProgress,
      )
    }
    // file extension according to file name
    const fileExt = this.file.name
      .slice(((this.file.name.lastIndexOf('.') - 1) >>> 0) + 2)
      .toLowerCase()
    // you only need the first 256 bytes or so to confirm file type
    const buffer = new Uint8Array(
      await this.file.file.slice(0, 256).arrayBuffer(),
    )
    // file extension according to byte data
    const dataExt = filetypeextension(buffer)[0]

    // magicbytes declares svg as xml, so we need to manually check
    const decodedFile = new TextDecoder().decode(buffer)
    if (decodedFile.includes('xmlns="http://www.w3.org/2000/svg"')) {
      // if corrupted, set .svg extension
      if (fileExt !== 'svg') {
        this.name += '.svg'
      }
      return
    }

    // if corrupted txt file
    if (!dataExt && fileExt !== 'txt') {
      this.name += '.txt'
      return
    }

    // if corrupted file with wrong extension, force the correct one
    if (fileExt !== dataExt && dataExt) {
      this.name += `.${dataExt}`
    }
  },
  methods: {
    /**
     * @method setProgress
     * @description set progress (% out of 100) while file is being pulled from textile bucket. passed as a callback
     * @param num current progress in bytes
     * @param size total file size in bytes
     */
    setProgress(num: number, size: number) {
      this.progress = Math.floor((num / size) * 100)
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
