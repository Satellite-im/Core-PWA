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
        { text: 'Favorite', func: this.handle },
        { text: 'Share', func: this.handle },
        { text: 'Rename', func: this.handle },
        { text: 'Delete', func: this.handle },
      ],
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    this.$data.timer = setInterval(
      this.forceRender,
      this.$Config.chat.timestampUpdateInterval,
    )
  },
  beforeDestroy() {
    if (this.$data.timer) {
      clearInterval(this.$data.timer)
    }
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
     * @method forceRender
     * @description force reactivity for Map
     */
    forceRender() {
      this.$emit('forceRender')
    },
  },
})
</script>
<style scoped lang="less" src="./Row.less"></style>
