<template src="./Aside.html"></template>
<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { SimpleItem } from '~/types/ui/sidebar'
import { FileRouteEnum, FileIconsEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  data() {
    return {
      totalSize: this.$filesize(iridium.files.totalSize),
      percentageUsed: iridium.files.percentStorageUsed,
    }
  },
  computed: {
    sizeLimit(): string {
      return this.$filesize(this.$Config.personalFilesLimit)
    },
    sizeColor(): string {
      return this.percentageUsed > 90 ? 'red' : 'green'
    },
    quickAccessOptions(): SimpleItem[] {
      return [
        {
          text: this.$t('pages.files.aside.default'),
          route: FileRouteEnum.DEFAULT,
          icon: FileIconsEnum.FOLDER,
        },
        {
          text: this.$t('pages.files.aside.recent'),
          route: FileRouteEnum.RECENT,
          icon: FileIconsEnum.CLOCK,
        },
        // remove for demo
        // {
        //   text: this.$t('pages.files.aside.deleted'),
        //   route: FileRouteEnum.DELETED,
        //   icon: FileIconsEnum.TRASH,
        // },
        // {
        //   text: this.$t('pages.files.aside.favorited'),
        //   route: FileRouteEnum.FAVORITED,
        //   icon: FileIconsEnum.HEART,
        // },
      ]
    },
    sharedItemsOptions(): SimpleItem[] {
      return [
        {
          text: this.$t('pages.files.aside.shared_folders'),
          route: FileRouteEnum.SHARED,
          icon: FileIconsEnum.FOLDER,
        },
        {
          text: this.$t('pages.files.aside.links'),
          route: FileRouteEnum.LINKS,
          icon: FileIconsEnum.LINK,
        },
      ]
    },
  },
})
</script>
<style scoped lang="less" src="./Aside.less"></style>
