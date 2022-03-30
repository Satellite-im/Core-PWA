<template src="./File.html"></template>
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
} from 'satellite-lucide-icons'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Directory } from '~/libraries/Files/Directory'
import { Fil } from '~/libraries/Files/Fil'
import { ContextMenuItem, ModalWindows } from '~/store/ui/types'
import { isMimeArchive } from '~/utilities/FileType'

export default Vue.extend({
  components: {
    LinkIcon,
    HeartIcon,
    FolderIcon,
    FileIcon,
    ArchiveIcon,
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
      fileSize: '' as string,
      fileHover: false as boolean,
      linkHover: false as boolean,
      heartHover: false as boolean,
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
        {
          text: this.item.shared
            ? this.$t('context.unshare')
            : this.$t('context.share'),
          func: this.share,
        },
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
     * @description Open rename modal
     */
    rename() {
      this.$store.commit('ui/setRenameItem', this.item.name)
      this.$store.commit('ui/toggleModal', {
        name: ModalWindows.RENAME_FILE,
        state: !this.ui.modals[ModalWindows.RENAME_FILE],
      })
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
<style scoped lang="less" src="./File.less"></style>
