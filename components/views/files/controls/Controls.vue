<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { FolderPlusIcon, FilePlusIcon } from 'satellite-lucide-icons'
import { isHeic } from '~/utilities/FileType'
import { SettingsRoutes } from '~/store/ui/types'
import { RootState } from '~/types/store/store'
import { FileSystemErrors } from '~/libraries/Files/errors/Errors'
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
    }
  },
  computed: {
    ...mapState({
      filesUploadStatus: (state) => (state as RootState).ui.filesUploadStatus,
      consentToScan: (state) =>
        (state as RootState).textile.userThread.consentToScan,
    }),
    ...mapGetters('ui', ['isFilesIndexLoading']),
  },
  methods: {
    /**
     * @method addFile
     * @description Trigger click on invisible file input on button click
     */
    addFile() {
      if (!this.consentToScan) {
        this.$toast.error(
          this.$t('pages.files.errors.enable_consent') as string,
          {
            duration: 3000,
          },
        )
        this.$store.commit('ui/toggleSettings', {
          show: true,
          defaultRoute: SettingsRoutes.PRIVACY,
        })
        return
      }
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
      this.$emit('clearErrors')
      try {
        this.$FileSystem.createDirectory({ name: this.text })
      } catch (e: any) {
        this.$emit('addError', this.$t(e?.message))
        return
      }
      this.text = ''
      this.$emit('export')
    },

    handleInput(event: any) {
      this.handleFile([...event.target.files])
    },

    /**
     * @method handleFile
     * @description validate files and prepare for upload
     * @param {File[]} originalFiles files to upload
     * @example <input @change="handleFile" />
     */
    async handleFile(originalFiles: File[]) {
      this.$emit('clearErrors')
      this.$store.commit(
        'ui/setFilesUploadStatus',
        this.$t('pages.files.status.prepare'),
      )

      // if these files go over the storage limit, prevent upload
      if (
        originalFiles.reduce(
          (total, curr) => total + curr.size,
          this.$FileSystem.totalSize,
        ) > this.$Config.personalFilesLimit
      ) {
        this.$store.commit('ui/setFilesUploadStatus', '')
        this.$emit('addError', this.$t('pages.files.errors.storage_limit'))
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
      const files: { file: File; nsfw: boolean }[] = await Promise.all(
        sameNameResults.map(async (file: File) => {
          // convert heic to jpg for scan. return original heic if sfw
          if (await isHeic(file)) {
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
        }),
      )

      for (const file of files) {
        try {
          this.$store.commit(
            'ui/setFilesUploadStatus',
            this.$t('pages.files.status.upload', [file.file.name]),
          )
          await this.$FileSystem.uploadFile(
            file.file,
            file.nsfw,
            this.setProgress,
          )
        } catch (e: any) {
          // if out of date, sync
          if (e.message === FileSystemErrors.NON_FF) {
            await this.$store.dispatch('textile/syncFileSystem')
            this.$emit('addError', this.$t('pages.files.errors.out_of_date'))
            return
          }
        }
      }

      // only update index if files have been updated
      if (files.length) {
        this.$emit('export')
      }

      if (originalFiles.length !== invalidNameResults.length) {
        this.$emit('addError', this.$t('pages.files.errors.invalid'))
      }
      if (invalidNameResults.length !== emptyFileResults.length) {
        this.$emit('addError', this.$t('pages.files.errors.file_size'))
      }
      if (emptyFileResults.length !== sameNameResults.length) {
        this.$emit('addError', this.$t('pages.files.errors.duplicate_name'))
      }
    },
    /**
     * @method setProgress
     * @description set progress (% out of 100) while file is being pushed to textile bucket. passed as a callback
     * we encountered a bug where % was getting set to 105, math.min fixes that
     * @param num current progress in bytes
     * @param size total file size in bytes
     */
    setProgress(num: number, size: number, name: string) {
      this.$store.commit(
        'ui/setFilesUploadStatus',
        this.$t('pages.files.status.upload', [
          `${name} - ${Math.min(Math.floor((num / size) * 100), 100)}%`,
        ]),
      )
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
