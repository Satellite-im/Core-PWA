<template src="./File.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import {
  LinkIcon,
  HeartIcon,
  FolderIcon,
  FileIcon,
  BriefcaseIcon,
  ImageIcon,
} from 'satellite-lucide-icons'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Directory } from '~/libraries/Files/Directory'
import { Fil } from '~/libraries/Files/Fil'

declare module 'vue/types/vue' {
  interface Vue {
    like: () => void
    share: () => void
    rename: () => void
    remove: () => void
    $filesize: (item: number) => string
  }
}

export default Vue.extend({
  components: {
    LinkIcon,
    HeartIcon,
    FolderIcon,
    FileIcon,
    BriefcaseIcon,
    ImageIcon,
  },
  mixins: [ContextMenu],
  props: {
    /**
     * File or Directory to be displayed in detail
     */
    item: {
      type: Object as PropType<Item>,
      required: true,
    },
  },
  data() {
    return {
      fileUrl: String,
      fileSize: '',
      fileHover: false,
      linkHover: false,
      heartHover: false,
    }
  },
  computed: {
    ...mapState(['ui']),
    /**
     * @returns {string} if directory, child count. if file, size
     */
    getSubtext(): string {
      return this.item instanceof Directory
        ? this.item.content.length + ' items'
        : this.$filesize((this.item as Fil).size)
    },
    /**
     * @returns {boolean} if item has discrete MIME type of image
     */
    isImage(): boolean {
      return this.item.type.includes('image')
    },
    /**
     * @returns {boolean} if item is archive file type
     */
    isArchive(): boolean {
      return Boolean(this.item.name.match(this.$Config.regex.archive))
    },
    /**
     * @returns {boolean} if item is archive file type
     */
    contextMenuValues() {
      return [
        { text: this.item.liked ? 'Un-favorite' : 'Favorite', func: this.like },
        { text: 'Share', func: this.share },
        { text: 'Rename', func: this.rename },
        { text: 'Delete', func: this.delete },
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
     * @method rename
     * @description Emit to rename item - pages/files/browse/index.vue
     */
    rename() {
      this.$emit('rename', this.item)
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
<style scoped lang="less" src="./File.less"></style>
