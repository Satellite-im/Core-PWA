<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'

import { FolderPlusIcon, FilePlusIcon } from 'satellite-lucide-icons'
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
      error: '' as string,
      load: false as boolean,
    }
  },
  methods: {
    /**
     * @method addFile
     * @description Trigger click on invisible file input on button click
     */
    addFile() {
      if (this.$refs.upload) (this.$refs?.upload as HTMLButtonElement).click()
    },

    /**
     * @method addFolder
     * @description Add new folder to fileSystem
     */
    async addFolder() {
      if (!this.text) {
        this.error = this.$t('pages.files.controls.folder_name') as string
        return
      }
      this.load = true
      // add folder to filesystem
      try {
        this.$FileSystem.createDirectory({ name: this.text })
      } catch (e: any) {
        this.error = e?.message ?? ''
        this.load = false
        return
      }
      this.text = ''
      this.error = ''
      await this.$Bucket.updateIndex(this.$FileSystem.export)
      this.load = false
      this.$emit('forceRender')
    },

    /**
     * @method handleFile
     * @description remove nsfw files then upload to filesystem
     * @param event Input event object
     * @example <input @change="handleFile" />
     */
    async handleFile(event: any) {
      this.error = ''
      this.load = true
      const originalFiles: File[] = [...event.target.files]
      const sameNameResults: File[] = originalFiles.filter((file: File) => {
        return !this.$FileSystem.hasChild(file.name)
      })
      const nsfwResults: Promise<{ file: File; nsfw: boolean }>[] =
        sameNameResults.map(async (file: File) => {
          // todo - fix with AP-807. don't scan large files to prevent crash
          if (file.size > this.$Config.uploadByteLimit) {
            return { file, nsfw: false }
          }
          // convert heic to jpg for scan. return original heic if sfw
          if (file.type === 'image/heic') {
            const buffer = new Uint8Array(await file.arrayBuffer())
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

      try {
        await Promise.all(
          files.map(async (file) => {
            return await this.$FileSystem.uploadFile(file)
          }),
        )
      } catch (e: any) {
        this.error = e?.message ?? ''
      }

      // only update index if files have been updated
      if (files.length) {
        await this.$Bucket.updateIndex(this.$FileSystem.export)
      }

      this.load = false
      this.$emit('forceRender')

      if (sameNameResults.length !== originalFiles.length) {
        this.error = this.$t('pages.files.errors.file_name') as string
        if (sameNameResults.length !== files.length) {
          this.error += `, ${this.$t('errors.chat.contains_nsfw') as string}`
          return
        }
      }
      if (nsfwResults.length !== files.length) {
        this.error = this.$t('errors.chat.contains_nsfw') as string
      }
    },

    /**
     * @method resetFileUpload
     * @description Clear the value of file input. handleFile will be called even if it's the same file again
     * @example <input @onclick="resetFileUpload" />
     */
    async resetFileUpload() {
      if (this.$refs.upload) (this.$refs.upload as HTMLFormElement).value = ''
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
