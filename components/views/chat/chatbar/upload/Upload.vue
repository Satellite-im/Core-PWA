<template src="./Upload.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { PlusIcon } from 'satellite-lucide-icons'
import { isHeic } from '~/utilities/FileType'
import createThumbnail from '~/utilities/Thumbnail'
import { blobToBase64 } from '~/utilities/BlobManip'
import iridium from '~/libraries/Iridium/IridiumManager'
import { RootState } from '~/types/store/store'
import { ItemErrors } from '~/libraries/Iridium/files/types'
import { notNull } from '~/utilities/typeGuard'

const convert = require('heic-convert')

const Upload = Vue.extend({
  components: {
    PlusIcon,
  },
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
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
    async handleFile(event: { target: { files: File[] } }) {
      document.body.style.cursor = 'progress'
      this.$store.dispatch('ui/setChatbarFocus')
      const target = event.target
      if (target.files === null) {
        return
      }
      const newFiles: File[] = [...target?.files]

      const id = this.$route.params.id

      const filesToAdd: ({ file: File; nsfw: boolean } | null)[] =
        await Promise.all(
          newFiles.map(async (file: File) => {
            if (file.size === 0) {
              this.$toast.error(this.$t(ItemErrors.FILE_SIZE) as string)
              return null
            }
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
              return {
                file: filePng,
                nsfw: await this.$Security.isNSFW(filePng),
              }
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
      for (const file of filesToAdd.filter(notNull)) {
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
      document.body.style.cursor = 'default'
    },
  },
})
export type ChatbarUploadRef = InstanceType<typeof Upload>
export default Upload
</script>
<style scoped lang="less" src="./Upload.less"></style>
