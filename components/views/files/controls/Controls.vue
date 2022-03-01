<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { FolderPlusIcon, FilePlusIcon } from 'satellite-lucide-icons'
import { isHeic } from '~/utilities/Heic'
const convert = require('heic-convert')

export default Vue.extend({
  components: {
    FolderPlusIcon,
    FilePlusIcon,
  },
  // todo - best practice would be emitting rather than passing function as a prop - AP-639
  props: {
    /**
     * Switch between grid/table view
     */
    changeView: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      text: '' as string,
      errors: [] as Array<string>,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method addFile
     * @description Trigger click on invisible file input on button click
     */
    addFile() {
      if (this.$refs.upload) (this.$refs.upload as HTMLButtonElement).click()
    },

    /**
     * @method resetFileUpload
     * @description Clear the value of file input. handleFile will be called even if it's the same file again
     * @example <input @onclick="resetFileUpload" />
     */
    resetFileUpload() {
      if (this.$refs.upload) (this.$refs.upload as HTMLFormElement).value = ''
    },

    /**
     * @method addFolder
     * @description Add new folder to fileSystem
     */
    async addFolder() {
      this.errors = []
      if (!this.text) {
        this.errors.push(this.$t('pages.files.controls.folder_name') as string)
        return
      }
      this.$store.commit('ui/setIsLoadingFileIndex', true)
      // add folder to filesystem
      try {
        this.$FileSystem.createDirectory({ name: this.text })
      } catch (e: any) {
        this.errors.push(e?.message ?? '')
        this.$store.commit('ui/setIsLoadingFileIndex', false)
        return
      }
      this.text = ''
      await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      this.$store.commit('ui/setIsLoadingFileIndex', false)
      this.$emit('forceRender')
    },

    /**
     * @method handleFile
     * @description remove nsfw files then upload to filesystem
     * @param event Input event object
     * @example <input @change="handleFile" />
     */
    async handleFile(event: any) {
      this.errors = []
      const originalFiles: File[] = [...event.target.files]

      // if these files go over the storage limit, prevent upload
      if (
        originalFiles.reduce(
          (total, curr) => total + curr.size,
          this.$FileSystem.totalSize,
        ) > this.$Config.personalFilesLimit
      ) {
        this.errors.push(this.$t('pages.files.errors.limit') as string)
        return
      }
      this.$store.commit('ui/setIsLoadingFileIndex', true)
      // todo - for now, index is stored in the bucket. we could try moving it to the thread, then sat.json wouldn't be reserved
      const protectedNameResults: File[] = originalFiles.filter(
        (file) => !(file.name === 'sat.json'),
      )
      // filter out files with 0 bytes size
      const emptyFileResults: File[] = protectedNameResults.filter(
        (file) => !(file.size === 0),
      )
      // filter out files with the same name as another file
      const sameNameResults: File[] = emptyFileResults.filter((file) => {
        return !this.$FileSystem.hasChild(file.name)
      })
      const nsfwResults: Promise<{ file: File; nsfw: boolean }>[] =
        sameNameResults.map(async (file: File) => {
          // todo - fix with AP-807. don't scan large files to prevent crash
          if (file.size > this.$Config.uploadByteLimit) {
            return { file, nsfw: false }
          }
          // convert heic to jpg for scan. return original heic if sfw
          const buffer = new Uint8Array(await file.arrayBuffer())
          if (isHeic(buffer)) {
            const outputBuffer = await convert({
              buffer,
              format: 'JPEG',
              quality: 1,
            })
            const fileJpg = new File([outputBuffer.buffer], file.name, {
              type: 'image/jpeg',
            })
            return { file, nsfw: await this.$Security.isNSFW(fileJpg) }
          }

          // todo - fix this as part of AP-807. marks nsfw if unscannable image type (tiff)
          let nsfw
          try {
            nsfw = await this.$Security.isNSFW(file)
          } catch {
            nsfw = true
          }

          return { file, nsfw }
        })

      const files: File[] = []

      for await (const el of nsfwResults) {
        if (!el.nsfw) {
          files.push(el.file)
        }
      }

      for (const file of files) {
        try {
          await this.$FileSystem.uploadFile(file)
        } catch (e: any) {
          this.errors.push(e?.message ?? '')
        }
      }

      // only update index if files have been updated
      if (files.length) {
        await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      }

      this.$store.commit('ui/setIsLoadingFileIndex', false)

      this.$emit('forceRender')

      if (originalFiles.length !== protectedNameResults.length) {
        this.errors.push(this.$t('pages.files.errors.reserved_name') as string)
      }
      if (protectedNameResults.length !== emptyFileResults.length) {
        this.errors.push(this.$t('pages.files.errors.empty_file') as string)
      }
      if (emptyFileResults.length !== sameNameResults.length) {
        this.errors.push(this.$t('pages.files.errors.file_name') as string)
      }
      if (nsfwResults.length !== files.length) {
        this.errors.push(this.$t('errors.chat.contains_nsfw') as string)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
