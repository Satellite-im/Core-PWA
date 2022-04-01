<template src="./List.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import {
  FilterIcon,
  FolderIcon,
  ArchiveIcon,
  FileIcon,
  ImageIcon,
  LockIcon,
  UnlockIcon,
  MoreVerticalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'satellite-lucide-icons'

import { FileSortEnum } from '~/libraries/Enums/enums'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { FileSort } from '~/types/files/file'

export default Vue.extend({
  components: {
    FilterIcon,
    FileIcon,
    FolderIcon,
    ArchiveIcon,
    ImageIcon,
    LockIcon,
    UnlockIcon,
    MoreVerticalIcon,
    ChevronDownIcon,
    ChevronUpIcon,
  },
  props: {
    /**
     * Directory items to be displayed
     */
    directory: {
      type: Array as PropType<Array<Item>>,
      required: true,
    },
    /**
     * counter to force reactivity for Map
     */
    counter: {
      type: Number,
      required: true,
    },
    sort: {
      type: Object as PropType<FileSort>,
      required: true,
    },
  },
  data() {
    return {
      timer: null,
    }
  },
  computed: {
    ...mapState(['ui']),
    FileSortEnum: () => FileSortEnum,
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
     * @method forceRender
     * @description refresh items timestamp - called every minute
     */
    forceRender() {
      this.$emit('forceRender')
    },
    /**
     * @method handle
     * @description Emit item to be handled in pages/files/browse/index.vue
     */
    handle(item: Item) {
      this.$emit('handle', item)
    },
    /**
     * @method like
     * @description Emit to like item - pages/files/browse/index.vue
     */
    like(item: Item) {
      this.$emit('like', item)
    },
    /**
     * @method share
     * @description Emit to share item - pages/files/browse/index.vue
     */
    share(item: Item) {
      this.$emit('share', item)
    },
    /**
     * @method remove
     * @description Emit to delete item - pages/files/browse/index.vue
     */
    remove(item: Item) {
      this.$emit('remove', item)
    },
    setSort(category: FileSortEnum) {
      this.$emit('setSort', category)
    },
  },
})
</script>
<style scoped lang="less" src="./List.less"></style>
