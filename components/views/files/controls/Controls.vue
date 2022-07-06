<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import {
  FolderPlusIcon,
  FilePlusIcon,
  AlertTriangleIcon,
  XIcon,
} from 'satellite-lucide-icons'
import { SettingsRoutes } from '~/store/ui/types'
import { RootState } from '~/types/store/store'
import fileSystem from '~/libraries/Files/FilSystem'
import iridium from '~/libraries/Iridium/IridiumManager'

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
      errors: [] as Array<string | TranslateResult>,
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
      // comment until we have the settings store figured out. some will need to be remote across instances, some should be local only
      // if (!this.consentToScan) {
      //   this.$toast.error(
      //     this.$t('pages.files.errors.enable_consent') as string,
      //     {
      //       duration: 3000,
      //     },
      //   )
      //   this.$store.commit('ui/toggleSettings', {
      //     show: true,
      //     defaultRoute: SettingsRoutes.PRIVACY,
      //   })
      //   return
      // }
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
      this.$store.commit(
        'ui/setFilesUploadStatus',
        this.$t('pages.files.status.index'),
      )
      try {
        fileSystem.createDirectory({ name: this.text })
      } catch (e: any) {
        this.errors.push(this.$t(e?.message))
        this.$store.commit('ui/setFilesUploadStatus', '')
        return
      }
      this.text = ''
      // await this.$store.dispatch('textile/exportFileSystem')
      this.$store.commit('ui/setFilesUploadStatus', '')

      this.$emit('forceRender')
    },

    handleInput(event: any) {
      this.handleFile([...event.target.files])
    },

    /**
     * @method handleFile
     * @description remove nsfw files then upload to filesystem
     * @param {File[]} originalFiles files to upload
     * @example <input @change="handleFile" />
     */
    async handleFile(originalFiles: File[]) {
      this.errors = []
      this.$store.commit(
        'ui/setFilesUploadStatus',
        this.$t('pages.files.status.prepare'),
      )

      // if these files go over the storage limit, prevent upload
      if (
        originalFiles.reduce(
          (total, curr) => total + curr.size,
          fileSystem.totalSize,
        ) > this.$Config.personalFilesLimit
      ) {
        this.$store.commit('ui/setFilesUploadStatus', '')
        this.errors.push(this.$t('pages.files.errors.storage_limit'))
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
      const files: File[] = emptyFileResults.filter((file) => {
        return !fileSystem.currentDirectory.hasChild(file.name)
      })

      for (const file of files) {
        try {
          this.$store.commit(
            'ui/setFilesUploadStatus',
            this.$t('pages.files.status.upload', [file.name]),
          )
          await iridium.files?.personalUpload(file)
        } catch (e: any) {
          this.errors.push(e?.message ?? '')
        }
      }

      // only update index if files have been updated
      if (files.length) {
        this.$store.commit(
          'ui/setFilesUploadStatus',
          this.$t('pages.files.status.index'),
        )
        // await this.$store.dispatch('textile/exportFileSystem')
      }

      this.$store.commit('ui/setFilesUploadStatus', '')

      // re-render so new files show up
      this.$emit('forceRender')

      if (originalFiles.length !== invalidNameResults.length) {
        this.errors.push(this.$t('pages.files.errors.invalid'))
      }
      if (invalidNameResults.length !== emptyFileResults.length) {
        this.errors.push(this.$t('pages.files.errors.file_size'))
      }
      if (emptyFileResults.length !== files.length) {
        this.errors.push(this.$t('pages.files.errors.duplicate_name'))
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
