<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  FolderPlusIcon,
  FilePlusIcon,
  AlertTriangleIcon,
  XIcon,
} from 'satellite-lucide-icons'
import { isHeic } from '~/utilities/FileType'
const convert = require('heic-convert')

export default Vue.extend({
  components: {
    FolderPlusIcon,
    FilePlusIcon,
    AlertTriangleIcon,
    XIcon,
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
      this.$store.commit('ui/setIsLoadingFileIndex', true)
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
      this.$store.commit('ui/setIsLoadingFileIndex', true)
      const originalFiles: File[] = [...event.target.files]

      // if these files go over the storage limit, prevent upload
      if (
        originalFiles.reduce(
          (total, curr) => total + curr.size,
          this.$FileSystem.totalSize,
        ) > this.$Config.personalFilesLimit
      ) {
        this.$store.commit('ui/setIsLoadingFileIndex', false)
        this.errors.push(this.$t('pages.files.errors.limit') as string)
        return
      }
      // todo - move validation inside of file constructor
      const invalidNameResults: File[] = originalFiles.filter(
        (file) => !this.$Config.regex.invalid.test(file.name),
      )
      // filter out files with 0 bytes size
      const emptyFileResults: File[] = invalidNameResults.filter(
        (file) => !(file.size === 0),
      )
      // filter out files with the same name as another file
      const sameNameResults: File[] = emptyFileResults.filter((file) => {
        return !this.$FileSystem.currentDirectory.hasChild(file.name)
      })
      const nsfwResults: Promise<{ file: File; nsfw: boolean }>[] =
        sameNameResults.map(async (file: File) => {
          // convert heic to jpg for scan. return original heic if sfw
          if (await isHeic(file)) {
            // prevent crash in case of larger than 2GB heic files. could possibly be broken up into multiple buffers
            if (file.size >= this.$Config.arrayBufferLimit) {
              return { file, nsfw: false }
            }
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

          let nsfw
          try {
            nsfw = await this.$Security.isNSFW(file)
          } catch (e: any) {
            this.$Logger.log('Upload', e)
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

      if (originalFiles.length !== invalidNameResults.length) {
        this.errors.push(this.$t('pages.files.errors.invalid_name') as string)
      }
      if (invalidNameResults.length !== emptyFileResults.length) {
        this.errors.push(this.$t('pages.files.errors.empty_file') as string)
      }
      if (emptyFileResults.length !== sameNameResults.length) {
        this.errors.push(this.$t('pages.files.errors.item_name') as string)
      }
      if (nsfwResults.length !== files.length) {
        this.errors.push(this.$t('errors.chat.contains_nsfw') as string)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
