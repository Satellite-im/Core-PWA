<template src="./Image.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { ImageIcon, DownloadIcon } from 'satellite-lucide-icons'
import placeholderImage from '~/assets/svg/mascot/sad_curious.svg'
import { MessageAttachment } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ContextMenuItem } from '~/store/ui/types'
import { FILE_TYPE } from '~/libraries/Files/types/file'

export default Vue.extend({
  components: {
    ImageIcon,
    DownloadIcon,
  },
  props: {
    attachment: {
      type: Object as PropType<MessageAttachment>,
      required: true,
    },
  },
  data: () => ({
    usePlaceholder: false,
    dataURL: '',
    blob: null as Blob | null,
    pngBlob: null as Blob | null,
  }),
  computed: {
    placeholderImage: () => placeholderImage,
    contextMenuValues(): ContextMenuItem[] {
      // remove copy from GIF because it copies a still png version
      if (this.attachment.type === FILE_TYPE.GIF) {
        return [{ text: this.$t('context.save_img'), func: this.saveImage }]
      }
      return [
        { text: this.$t('context.copy_img'), func: this.copyImage },
        { text: this.$t('context.save_img'), func: this.saveImage },
      ]
    },
  },
  async mounted() {
    const { fileBuffer } = await iridium.connector?.load(this.attachment.cid)
    this.blob = new Blob([fileBuffer], { type: this.attachment.type })
    this.dataURL = URL.createObjectURL(this.blob)
  },
  beforeDestroy() {
    URL.revokeObjectURL(this.dataURL)
  },
  methods: {
    imageClick() {
      this.$store.commit('ui/setChatImageOverlay', {
        ...this.attachment,
        dataURL: this.dataURL,
      })
    },
    /**
     * @method copyImage
     * @description clipboard API only accepts png. if not png, convert via canvas
     */
    async copyImage() {
      if (!this.blob) {
        return
      }
      if (this.blob.type !== 'image/png') {
        this.pngBlob = await this.toPng()
      }
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': this.pngBlob || this.blob,
        }),
      ])
      this.$toast.show(this.$t('ui.copied') as string)
    },

    async saveImage() {
      const anchor = this.$refs.download as HTMLAnchorElement
      anchor.click()
    },
    /**
     * @method toPng
     * @param {Blob} blob embeddable image blob
     * @description helper function - convert image blob to png for Clipboard API
     */
    toPng() {
      return new Promise<Blob | null>((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = this.dataURL
        img.onload = () => {
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          ctx?.drawImage(img, 0, 0)
          canvas.toBlob((newBlob: Blob | null) => {
            resolve(newBlob)
          })
        }
      })
    },
  },
})
</script>
<style scoped lang="less" src="./Image.less"></style>
