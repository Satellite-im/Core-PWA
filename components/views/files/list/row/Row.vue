<template src="./Row.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import {
  FolderIcon,
  ArchiveIcon,
  FileIcon,
  ImageIcon,
  FilmIcon,
  MoreVerticalIcon,
} from 'satellite-lucide-icons'
import { ContextMenuItem } from '~/store/ui/types'
import { isMimeArchive } from '~/utilities/FileType'
import { IridiumItem } from '~/libraries/Iridium/files/types'

export default Vue.extend({
  components: {
    FileIcon,
    FolderIcon,
    ArchiveIcon,
    ImageIcon,
    FilmIcon,
    MoreVerticalIcon,
  },
  props: {
    item: {
      type: Object as PropType<IridiumItem>,
      required: true,
    },
  },
  data() {
    return {
      menuHover: false as boolean,
    }
  },
  computed: {
    ...mapState(['ui']),
    /**
     * @returns {boolean} if item has discrete MIME type of image
     */
    isImage(): boolean {
      return this.item.type.includes('image')
    },
    /**
     * @returns {boolean} if item has discrete MIME type of video
     */
    isVideo(): boolean {
      return this.item.type.includes('video')
    },
    /**
     * @returns {boolean} if item is archive file type
     */
    isArchive(): boolean {
      return isMimeArchive(this.item.type)
    },
    contextMenuValues(): ContextMenuItem[] {
      return [
        {
          text: this.item.liked
            ? this.$t('context.unfav')
            : this.$t('context.fav'),
          func: this.like,
        },
        // {
        //   text: this.item.shared
        //     ? this.$t('context.unshare')
        //     : this.$t('context.share'),
        //   func: this.share,
        // },
        { text: this.$t('context.rename'), func: this.rename },
        { text: this.$t('context.delete'), func: this.remove, type: 'danger' },
      ]
    },
  },
  methods: {
    /**
     * @method handle
     * @description Emit to handle item - pages/files/browse/index.vue
     */
    handle() {
      if (this.$data.menuHover) {
        return
      }
      this.$emit('handle', this.item)
    },
    /**
     * @method rename
     * @description Emit to rename item - pages/files/browse/index.vue
     */
    rename() {
      this.$emit('rename', this.item)
    },
    /**
     * @method like
     * @description Emit to like item - pages/files/browse/index.vue
     */
    like() {
      this.$emit('like', this.item)
    },
    /**
     * @method share
     * @description Emit to share item - pages/files/browse/index.vue
     */
    share() {
      this.$emit('share', this.item)
    },
    /**
     * @method remove
     * @description Emit to delete item - pages/files/browse/index.vue
     */
    remove() {
      this.$emit('remove', this.item)
    },
  },
})
</script>
<style scoped lang="less" src="./Row.less"></style>
