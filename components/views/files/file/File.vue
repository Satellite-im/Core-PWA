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
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'

import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Directory } from '~/libraries/Files/Directory'
import { Fil } from '~/libraries/Files/Fil'

declare module 'vue/types/vue' {
  interface Vue {
    linkHover: boolean
    heartHover: boolean
    path: string
    load: boolean
    handle: () => void
    like: () => void
    share: () => void
    rename: () => void
    delete: () => void
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
      contextMenuValues: [
        { text: 'Favorite', func: this.like },
        { text: 'Share', func: this.share },
        { text: 'Rename', func: this.rename },
        { text: 'Delete', func: this.delete },
      ],
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
      return this.item.type.split('/')[0] === 'image'
    },
    isArchive(): boolean {
      return Boolean(this.item.name.match(this.$Config.regex.archive))
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
    async like() {
      this.$store.commit('ui/setIsLoadingFileIndex', true)
      this.item.toggleLiked()
      await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      this.item.liked
        ? this.$toast.show(this.$t('pages.files.add_favorite') as string)
        : this.$toast.show(this.$t('pages.files.remove_favorite') as string)
      this.$store.commit('ui/setIsLoadingFileIndex', false)
      this.$emit('forceRender')
    },
    /**
     * @method share
     * @description copy link to clipboard
     */
    async share() {
      if (this.item instanceof Directory) {
        this.$toast.show(this.$t('todo - share folders') as string)
        return
      }
      if (!this.item.shared) {
        this.$store.commit('ui/setIsLoadingFileIndex', true)
        this.item.shareItem()
        await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
        this.$store.commit('ui/setIsLoadingFileIndex', false)
        this.$emit('forceRender')
      }
      navigator.clipboard.writeText(this.path).then(() => {
        this.$toast.show(this.$t('pages.files.link_copied') as string)
      })
    },
    /**
     * @method rename
     * @description todo
     */
    rename() {
      this.$toast.show(this.$t('todo - rename items') as string)
    },
    /**
     * @method delete
     * @description delete folder/file from filesystem. If file, also remove from textile bucket
     */
    async delete() {
      this.$store.commit('ui/setIsLoadingFileIndex', true)
      if (this.item instanceof Fil) {
        await this.$FileSystem.removeFile(this.item.name)
      }
      this.$FileSystem.removeChild(this.item.name)
      await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      this.$store.commit('ui/setIsLoadingFileIndex', false)
      this.$emit('forceRender')
    },
  },
})
</script>
<style scoped lang="less" src="./File.less"></style>
