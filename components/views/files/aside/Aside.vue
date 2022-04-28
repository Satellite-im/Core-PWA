<template src="./Aside.html"></template>
<script lang="ts">
import Vue from 'vue'
import { SimpleItem } from '~/types/ui/sidebar'
import { FileAsideRouteEnum, FileIconsEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  data() {
    return {
      progress: this.$FileSystem.percentStorageUsed as number,
    }
  },
  computed: {
    /**
     * @description total size of all uploaded files
     */
    totalSize(): string {
      return this.$filesize(this.$FileSystem.totalSize)
    },
    /**
     * @description storage space (free tier is 4GB)
     */
    sizeLimit(): string {
      return this.$filesize(this.$Config.personalFilesLimit)
    },
    sizeColor(): string {
      return this.progress > 90 ? 'red' : 'green'
    },
    quickAccessOptions(): SimpleItem[] {
      return [
        {
          text: this.$t('pages.files.aside.default'),
          route: FileAsideRouteEnum.DEFAULT,
          icon: FileIconsEnum.FOLDER,
        },
        {
          text: this.$t('pages.files.aside.recent'),
          route: FileAsideRouteEnum.RECENT,
          icon: FileIconsEnum.CLOCK,
        },
        {
          text: this.$t('pages.files.aside.deleted'),
          route: FileAsideRouteEnum.DELETED,
          icon: FileIconsEnum.TRASH,
        },
        {
          text: this.$t('pages.files.aside.favorited'),
          route: FileAsideRouteEnum.FAVORITED,
          icon: FileIconsEnum.HEART,
        },
      ]
    },
    sharedItemsOptions(): SimpleItem[] {
      return [
        {
          text: this.$t('pages.files.aside.shared_folders'),
          route: FileAsideRouteEnum.SHARED,
          icon: FileIconsEnum.FOLDER,
        },
        {
          text: this.$t('pages.files.aside.links'),
          route: FileAsideRouteEnum.LINKS,
          icon: FileIconsEnum.LINK,
        },
      ]
    },
  },
  watch: {
    totalSize() {
      this.progress = this.$FileSystem.percentStorageUsed
    },
  },
})
</script>
<style scoped lang="less" src="./Aside.less"></style>
