<template src="./Upload.html"></template>
<script lang="ts">
import { FilePlusIcon, PlusIcon } from 'satellite-lucide-icons'
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { isHeic } from '~/utilities/FileType'
import { getSizeFromAspectRatio } from '~/utilities/ImageSize'
import { SettingsRoutes } from '~/store/ui/types'
import { RootState } from '~/types/store/store'
import createThumbnail from '~/utilities/Thumbnail'
import blobToBase64 from '~/utilities/BlobToBase64'
const convert = require('heic-convert')

export default Vue.extend({
  components: {
    PlusIcon,
    FilePlusIcon,
  },
  computed: {
    ...mapState({
      consentToScan: (state) =>
        (state as RootState).textile.userThread.consentToScan,
    }),
    ...mapGetters({
      getFiles: 'chat/getFiles',
      recipient: 'conversation/recipient',
    }),
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

      if (this.$refs.upload) (this.$refs.upload as HTMLFormElement).click()
    },

    /**
     * @method handleFile
     * @description Handles file in event object by NSFW checking and then loading it. Triggered when a file is changed on the input.
     * @param event Input event object
     * @example <input @change="handleFile" />
     */
    async handleFile(event: any) {
      this.$store.dispatch('ui/setChatbarFocus')
      this.$store.commit('chat/setCountError', false)
      if (!this.recipient) {
        return
      }
      const newFiles: File[] = [...event.target.files]

      if (
        newFiles.length + this.getFiles.length >
        this.$Config.chat.uploadMaxLength
      ) {
        this.$store.commit('chat/setCountError', true)
        return
      }
      const address = this.recipient?.address

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
        const payload = {
          file: {
            ...file,
            progress: 0,
            thumbnail: thumbnail ? await blobToBase64(thumbnail) : '',
          },
          address,
        }

        const size = await getSizeFromAspectRatio(file.file)

        if (size) {
          payload.file = {
            ...payload.file,
            ...size,
          }
        }

        this.$store.commit('chat/addFile', payload)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Upload.less"></style>
