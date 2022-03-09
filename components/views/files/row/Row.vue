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
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'

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
      contextMenuValues: [
        { text: 'Favorite', func: this.todo },
        { text: 'Share', func: this.todo },
        { text: 'Rename', func: this.todo },
        { text: 'Delete', func: this.todo },
      ],
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method handle
     * @description Emit item to be handled in pages/files/browse/index.vue
     */
    handle() {
      if (this.menuHover) {
        return
      }
      this.$emit('handle', this.item)
    },
    /**
     * @description handle in AP-1054
     */
    todo() {
      this.$toast.show(this.$t('todo') as string)
    },
  },
})
</script>
<style scoped lang="less" src="./Row.less"></style>
