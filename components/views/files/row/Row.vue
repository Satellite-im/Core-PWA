<template src="./Row.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import {
  FolderIcon,
  ArchiveIcon,
  FileIcon,
  ImageIcon,
  LockIcon,
  UnlockIcon,
  MoreVerticalIcon,
} from 'satellite-lucide-icons'
import ContextMenu from '~/components/mixins/UI/ContextMenu'

import { Item } from '~/libraries/Files/abstracts/Item.abstract'

export default Vue.extend({
  components: {
    FileIcon,
    FolderIcon,
    ArchiveIcon,
    ImageIcon,
    LockIcon,
    UnlockIcon,
    MoreVerticalIcon,
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
      menuHover: false as boolean,
    }
  },
  computed: {
    ...mapState(['ui']),
    contextMenuValues() {
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
     * @method handle
     * @description Emit item to be handled in pages/files/browse/index.vue
     */
    handle() {
      if (this.$data.menuHover) {
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
<style scoped lang="less" src="./Row.less"></style>
