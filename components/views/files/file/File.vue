<template src="./File.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  LinkIcon,
  HeartIcon,
  FolderIcon,
  FileIcon,
} from 'satellite-lucide-icons'
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'

import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Directory } from '~/libraries/Files/Directory'
import { Fil } from '~/libraries/Files/Fil'

declare module 'vue/types/vue' {
  interface Vue {
    linkHover: boolean
    heartHover: boolean
    path: string
    handle: () => void
    like: () => void
    share: () => void
    rename: () => void
    delete: () => void
  }
}

export default Vue.extend({
  components: {
    LinkIcon,
    HeartIcon,
    FolderIcon,
    FileIcon,
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
      contextMenuValues: [
        { text: 'Favorite', func: this.like },
        { text: 'Share', func: this.share },
        { text: 'Rename', func: this.rename },
        { text: 'Delete', func: this.delete },
      ],
    }
  },
  computed: {
    /**
     * @returns Directory child count or item type
     */
    getSubtext(): string {
      return this.item instanceof Directory
        ? this.item.content.length + ' items'
        : this.$filesize((this.item as Fil).size)
    },
    isImage() {
      return this.item.name.match(this.$Config.regex.image)
    },
    path(): string {
      return this.item instanceof Fil
        ? this.$Config.textile.browser + this.item.hash
        : ''
    },
  },
  methods: {
    /**
     * @method fileClick
     * @description Handle regular file click. avoiding regular behavior(handle) if user clicks heart or link icon
     */
    fileClick() {
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
     * @description toggle like on file and force render for files
     */
    like() {
      this.item.toggleLiked()
      this.item.liked
        ? this.$toast.show(this.$t('pages.files.add_favorite') as string)
        : this.$toast.show(this.$t('pages.files.remove_favorite') as string)
      this.$emit('forceRender')
    },
    /**
     * @method share
     * @description copy link to clipboard
     */
    share() {
      this.item.shareItem()
      navigator.clipboard.writeText(this.path).then(() => {
        this.$toast.show(this.$t('pages.files.link_copied') as string)
      })
      this.$emit('forceRender')
    },
    /**
     * @method rename
     * @description todo
     */
    rename() {},
    /**
     * @method delete
     * @description todo
     */
    delete() {},
  },
})
</script>
<style scoped lang="less" src="./File.less"></style>
