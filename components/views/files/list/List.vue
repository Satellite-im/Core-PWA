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
     * @method handle
     * @description Emit item to be handled in pages/files/browse/index.vue
     */
    handle(item: Item) {
      this.$emit('handle', item)
    },
    /**
     * @method forceRender
     * @description force reactivity for Map
     */
    forceRender() {
      this.$emit('forceRender')
    },
    sort() {
      this.$toast.show(this.$t('todo - sort') as string)
    },
  },
})
</script>
<style scoped lang="less" src="./List.less"></style>
