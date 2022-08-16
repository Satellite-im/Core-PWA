<template src="./Controls.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import {
  FolderPlusIcon,
  FilePlusIcon,
  AlertTriangleIcon,
  XIcon,
  FolderIcon,
} from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ItemErrors } from '~/libraries/Iridium/files/types'

const Controls = Vue.extend({
  components: {
    FolderPlusIcon,
    FilePlusIcon,
    AlertTriangleIcon,
    XIcon,
    FolderIcon,
  },
  data() {
    return {
      searchValue: '' as string,
      newFolderName: '' as string,
      errors: [] as Array<string | TranslateResult>,
    }
  },
  computed: {
    ...mapState({
      currentUpload: (state) => (state as RootState).files.currentUpload,
      path: (state) => (state as RootState).files.path,
      status: (state) => (state as RootState).files.status,
      showSidebar: (state) => (state as RootState).ui.showSidebar,
      searchAll: (state) => (state as RootState).files.search.searchAll,
    }),
    consentToScan(): boolean {
      return iridium.settings.state.privacy.consentToScan
    },
  },
  watch: {
    searchValue(value: string) {
      this.$store.commit('files/setSearchValue', value)
    },
  },
  methods: {
    /**
     * @method addFile
     * @description Trigger click on invisible file input on button click
     */
    addFile() {
      if (!this.consentToScan) {
        this.$store.dispatch('ui/displayConsentSettings')
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
    addFolder() {
      this.errors = []
      try {
        iridium.files.addDirectory(
          this.newFolderName,
          this.path.at(-1)?.id ?? '',
        )
      } catch (e: any) {
        this.errors.push(this.$t(e?.message))
        return
      }
      this.newFolderName = ''
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
    async handleFile(files: File[]) {
      this.errors = []
      this.$store.commit(
        'files/setStatus',
        this.$t('pages.files.status.prepare'),
      )

      // if these files go over the storage limit, prevent upload
      if (
        files.reduce(
          (total, curr) => total + curr.size,
          iridium.files.totalSize,
        ) > this.$Config.personalFilesLimit
      ) {
        this.$store.commit('files/setStatus', '')
        this.errors.push(this.$t(ItemErrors.LIMIT))
        return
      }

      for (const file of files) {
        this.$store.commit('files/setCurrentUpload', {
          name: file.name,
          size: file.size,
        })
        await iridium.files
          .addFile({
            file,
            parentId: this.path.at(-1)?.id ?? '',
            options: { progress: this.setProgress },
          })
          .catch((e) => {
            // ensure there aren't any duplicate error messages
            if (!this.errors.includes(this.$t(e?.message)))
              this.errors.push(this.$t(e?.message ?? ''))
          })
      }
      this.$store.commit('files/setStatus', '')
      this.$store.commit('files/setCurrentUpload', undefined)
    },
    /**
     * @method setProgress
     * @description set progress (% out of 100) while file is being pushed to ipfs
     * @param bytes current upload progress in bytes
     */
    setProgress(bytes: number) {
      if (!this.currentUpload) {
        return
      }
      this.$store.commit(
        'files/setStatus',
        this.$t('pages.files.status.upload', [
          `${this.currentUpload.name} - ${Math.min(
            Math.floor((bytes / this.currentUpload.size) * 100),
            100,
          )}%`,
        ]),
      )
    },

    /**
     @ method toggleSearchAll
     * @description Toggle search all.
     */
    toggleSearchAll() {
      this.$store.commit('files/toggleSearchAll')
    },
  },
})
export type FilesControlsRef = InstanceType<typeof Controls>
export default Controls
</script>
<style scoped lang="less" src="./Controls.less"></style>
