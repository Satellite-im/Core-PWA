<template src="./Upload.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { PlusIcon } from 'satellite-lucide-icons'
import { isHeic } from '~/utilities/FileType'
import { SettingsRoutes } from '~/store/ui/types'
import createThumbnail from '~/utilities/Thumbnail'
import { blobToBase64 } from '~/utilities/BlobManip'
import iridium from '~/libraries/Iridium/IridiumManager'
import { RootState } from '~/types/store/store'

const convert = require('heic-convert')

const Upload = Vue.extend({
  components: {
    PlusIcon,
  },
  computed: {
    ...mapState({
      files(state: RootState) {
        return state.chat.files?.[this.$route.params.id] ?? []
      },
    }),
    consentToScan(): boolean {
      return iridium.settings.state.privacy.consentToScan
    },
  },
  methods: {
    /**
     * @method resetFileInput
     * @description Clear the value of file input so trigger the handleFile for the same file.
     * @example <input @onclick="resetFileInput" />
     */
    async resetFileInput() {
      if (this.$refs.upload) (this.$refs.upload as HTMLFormElement).value = ''
    },

    /**
     * @method clickFileInput
     * @description click invisible file input if you have upload permissions
     */
    clickFileInput() {
      if (!this.consentToScan) {
        this.$store.dispatch('ui/displayConsentSettings')
        return
      }

      if (this.$refs.upload) (this.$refs.upload as HTMLFormElement).click()
    },

    /**
     * @method handleFile
     * @description Handles file in event object by NSFW checking and then loading it. Triggered when a file is changed on the input.
     * @param event Input event object
     * @example <input @change="handleFile" />
     */
    async handleFile(event: InputEvent) {
      this.$store.dispatch('ui/setChatbarFocus')
      this.$store.commit('chat/setCountError', false)
      const target = event.target as HTMLInputElement
      if (target.files === null) {
        return
      }
      const newFiles: File[] = [...target?.files]

      if (
        newFiles.length + this.files.length >
        this.$Config.chat.uploadMaxLength
      ) {
        this.$store.commit('chat/setCountError', true)
        return
      }
      const id = this.$route.params.id

      const filesToAdd: { file: File; nsfw: boolean }[] = await Promise.all(
        newFiles.map(async (file: File) => {
          // if heic, convert to jpeg so recipient can see in browser
          if (await isHeic(file)) {
            const buffer = new Uint8Array(await file.arrayBuffer())
            const outBuffer = await convert({
              buffer,
              format: 'PNG',
              quality: 1,
            })
            const filePng = new File([outBuffer.buffer], `${file.name}.png`, {
              type: 'image/png',
            })
            return { file: filePng, nsfw: await this.$Security.isNSFW(filePng) }
          }

          // handle non heic
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

      // set files to show preview, do not send
      for (const file of filesToAdd) {
        const thumbnail = await createThumbnail(file.file, 200)
        this.$store.commit('chat/addFile', {
          file: {
            ...file,
            progress: 0,
            thumbnail: thumbnail ? await blobToBase64(thumbnail) : '',
          },
          id,
        })
      }
    },
  },
})
export type ChatbarUploadRef = InstanceType<typeof Upload>
export default Upload
</script>
<style scoped lang="less" src="./Upload.less"></style>
