<template src="./Aside.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SimpleItem } from '~/types/ui/sidebar'
import { FileRouteEnum, FileIconsEnum } from '~/libraries/Enums/enums'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  computed: {
    ...mapState({
      fileSystem: (state) => (state as RootState).textile.fileSystem,
    }),
    /**
     * @description total size of all uploaded files
     */
    totalSize(): string {
      return this.$filesize(this.fileSystem.totalSize)
    },
    /**
     * @description storage space (free tier is 4GB)
     */
    sizeLimit(): string {
      return this.$filesize(this.$Config.personalFilesLimit)
    },
    sizeColor(): string {
      return this.fileSystem.percentageUsed > 90 ? 'red' : 'green'
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
