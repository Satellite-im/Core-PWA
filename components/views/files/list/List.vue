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
} from 'satellite-lucide-icons'

import { Item } from '~/libraries/Files/abstracts/Item.abstract'

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
  },
  data() {
    return {
      timer: null,
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
     * @method rename
     * @description Emit to rename item - pages/files/browse/index.vue
     */
    rename(item: Item) {
      this.$emit('rename', item)
    },
    /**
     * @method remove
     * @description Emit to delete item - pages/files/browse/index.vue
     */
    remove(item: Item) {
      this.$emit('remove', item)
    },
    sort() {
      this.$toast.show(this.$t('todo - sort') as string)
    },
  },
})
</script>
<style scoped lang="less" src="./List.less"></style>
