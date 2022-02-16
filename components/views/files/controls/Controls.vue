<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'

import { FolderPlusIcon, FilePlusIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    FolderPlusIcon,
    FilePlusIcon,
  },
  // todo - best practice would be emitting rather than passing function as a prop - AP-639
  props: {
    changeView: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      text: '' as string,
      error: '' as string,
      files: [] as Array<File>,
    }
  },
  methods: {
    addFile() {
      // @ts-ignore
      this.$refs?.upload.click()
    },

    addFolder() {
      if (!this.text) {
        this.error = 'Please enter a folder name'
        return
      }
      // add folder to filesystem
      try {
        this.$FileSystem.createDirectory(this.text)
      } catch (e: any) {
        this.error = e?.message ?? ''
        return
      }
      this.error = ''
      this.text = ''
      this.$emit('forceRender')
    },

    /**
     * @method handleFile
     * @description Handles file in event object by NSFW checking. Triggered when a file is changed on the input.
     * @param event Input event object
     * @example <input @change="handleFile" />
     */
    async handleFile(event: any) {
      this.files = []
      this.error = ''
      const nsfwResults = [...event.target.files].map(async (file) => {
        return { file, nsfw: await this.$Security.isNSFW(file) }
      })

      for await (const e of nsfwResults) {
        if (!e.nsfw) {
          this.files.push(e.file)
        }
      }

      this.files.forEach((file) => {
        try {
          this.$FileSystem.createFile(file.name)
        } catch (e: any) {
          this.error = e?.message ?? ''
          return
        }
        this.$emit('forceRender')
      })

      if (nsfwResults.length !== this.files.length) {
        this.error = this.$t('errors.chat.contains_nsfw') as string
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
