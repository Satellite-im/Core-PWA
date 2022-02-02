<template src="./Image.html" />
<script lang="ts">
import Vue, { PropType } from 'vue'
import { ImageIcon, DownloadIcon } from 'satellite-lucide-icons'
import { FileMessage, ImageMessage } from '~/types/textile/mailbox'

export default Vue.extend({
  components: {
    ImageIcon,
    DownloadIcon,
  },
  props: {
    alt: {
      type: String,
      default: 'Image',
    },
    url: {
      type: String,
      default: 'url',
    },
    full: {
      type: Boolean,
      default: false,
    },
    image: {
      type: Object as PropType<ImageMessage>,
      required: true,
    },
  },
  data() {
    return {
      showfull: false,
      fileSize: '',
    }
  },
  computed: {
    getFileSize() {
      return this.bytesToSize(this.image.size)
    },
  },
  methods: {
    /**
     * @method bytesToSize
     * @description converts bytes to display easily readable file size
     * @param bytes bytes of current file
     * @example bytesToSize(this.file.size)
     */
    bytesToSize(bytes: number) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Bytes'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`
    },
    async downloadImage(imageURL: string) {},
    /**
     * @method openImage DocsTODO
     * @description
     * @example
     */
    openImage() {
      window?.open(this.$props.image.url, '_blank').focus()
    },
  },
})
</script>
<style scoped lang="less" src="./Image.less"></style>
