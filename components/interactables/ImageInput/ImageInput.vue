<template>
  <input
    ref="imageInput"
    type="file"
    :accept="acceptableImageFormats"
    @change="onChange"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { PlatformTypeEnum } from '~/libraries/Enums/enums'
import { FILE_TYPE } from '~/libraries/Files/types/file'

export default Vue.extend({
  computed: {
    /**
     * @method acceptableImageFormats
     * @description embeddable types plus HEIC since we can convert
     * ios doesn't support advanced <input> accept
     * @returns {string} comma separated list of types
     */
    acceptableImageFormats(): string {
      return this.$envinfo.currentPlatform === PlatformTypeEnum.IOS
        ? 'image/*'
        : [
            FILE_TYPE.APNG,
            FILE_TYPE.AVIF,
            FILE_TYPE.GIF,
            FILE_TYPE.JPG,
            FILE_TYPE.PNG,
            FILE_TYPE.WEBP,
            FILE_TYPE.SVG,
            FILE_TYPE.HEIC,
          ].join(',')
    },
  },
  methods: {
    onChange(file: File): void {
      this.$emit('change', file)
    },
  },
})
</script>

<style scoped lang="less">
input {
  display: none;
}
</style>
