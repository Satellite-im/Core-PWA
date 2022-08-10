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
import { ContextMenuItem } from '~/store/ui/types'
import { isMimeArchive } from '~/utilities/FileType'
import { RootState } from '~/types/store/store'
import { IridiumItem } from '~/libraries/Iridium/files/types'
import iridium from '~/libraries/Iridium/IridiumManager'

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
  props: {
    item: {
      type: Object as PropType<IridiumItem>,
      required: true,
    },
  },
  data() {
    return {
      thumbnail: '',
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      blockNsfw: (state) => (state as RootState).textile.userThread.blockNsfw,
      gridLayout: (state) => (state as RootState).files.gridLayout,
    }),
    modifiedDate(): Date {
      return new Date(this.item.modified)
    },
    /**
     * @returns {string} if directory, child count. if file, size
     */
    subtext(): string {
      return 'children' in this.item
        ? this.$tc('pages.files.item_count', this.item.children.length)
        : `${this.item.type}┃${this.$filesize(this.item.size)}`
    },
    isImage(): boolean {
      return this.item.type.includes('image')
    },
    isVideo(): boolean {
      return this.item.type.includes('video')
    },
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
  async mounted() {
    // if item is IridiumFile and has thumbnail cid stored
    if ('thumbnail' in this.item && this.item.thumbnail) {
      this.thumbnail = URL.createObjectURL(
        await iridium.files.fetchThumbnail(this.item.thumbnail, this.item.type),
      )
    }
  },
  beforeDestroy() {
    if (this.thumbnail) URL.revokeObjectURL(this.thumbnail)
  },
  methods: {
    /**
     * @method click
     * @description handle file click depending on various hover statuses
     */
    click() {
      this.$emit('handle', this.item)
    },
    /**
     * @method rename
     * @description Emit to rename item - pages/files/index.vue
     */
    rename() {
      this.$emit('rename', this.item)
    },
    /**
     * @method like
     * @description Emit to like item - pages/files/index.vue
     */
    like() {
      this.$emit('like', this.item)
    },
    /**
     * @method share
     * @description Emit to share item - pages/files/index.vue
     */
    share() {
      this.$emit('share', this.item)
    },
    /**
     * @method remove
     * @description Emit to delete item - pages/files/index.vue
     */
    remove() {
      this.$emit('remove', this.item)
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
