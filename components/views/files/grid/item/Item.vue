<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import {
  LinkIcon,
  HeartIcon,
  FolderIcon,
  FileIcon,
  ArchiveIcon,
  ImageIcon,
  FilmIcon,
} from 'satellite-lucide-icons'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { ContextMenuItem, ModalWindows } from '~/store/ui/types'
import { isMimeArchive } from '~/utilities/FileType'
import { RootState } from '~/types/store/store'
import { IridiumItem } from '~/libraries/Iridium/files/types'

export default Vue.extend({
  components: {
    LinkIcon,
    HeartIcon,
    FolderIcon,
    FileIcon,
    ArchiveIcon,
    ImageIcon,
    FilmIcon,
  },
  mixins: [ContextMenu],
  props: {
    /**
     * File or Directory to be displayed in detail
     */
    item: {
      type: Object as PropType<IridiumItem>,
      required: true,
    },
  },
  data() {
    return {
      fileHover: false as boolean,
      linkHover: false as boolean,
      heartHover: false as boolean,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      blockNsfw: (state) => (state as RootState).textile.userThread.blockNsfw,
    }),
    /**
     * @returns {string} if directory, child count. if file, size
     */
    getSubtext(): string {
      return 'children' in this.item
        ? this.$tc('pages.files.item_count', this.item.children.length)
        : this.$filesize(this.item.size)
    },
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
        { text: this.$t('context.delete'), func: this.remove },
      ]
    },
  },
  methods: {
    /**
     * @method click
     * @description handle file click depending on various hover statuses
     */
    click() {
      if (this.linkHover) {
        this.share()
        return
      }
      if (this.heartHover) {
        this.like()
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
<style scoped lang="less" src="./Item.less"></style>
