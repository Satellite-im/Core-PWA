<template src="./View.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import {
  FileIcon,
  DownloadIcon,
  SlashIcon,
  ArchiveIcon,
  XIcon,
  LinkIcon,
} from 'satellite-lucide-icons'
import { Fil } from '~/libraries/Files/Fil'

export default Vue.extend({
  components: {
    FileIcon,
    DownloadIcon,
    SlashIcon,
    ArchiveIcon,
    XIcon,
    LinkIcon,
  },
  props: {
    file: {
      type: Object as PropType<Fil>,
      required: true,
    },
  },
  data() {
    return {
      load: false as boolean,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  /**
   * if no file data available, pull encrypted file from textile bucket and save as blob
   */
  async mounted() {
    if (!this.file.file) {
      this.load = true
      const fsFile: Fil = this.$FileSystem.getChild(this.file.name) as Fil
      fsFile.file = await this.$TextileManager.bucket?.pullFile(
        this.file.name,
        this.file.type,
      )
      this.load = false
    }
  },
  methods: {
    /**
     * @method share
     * @description Emit to share item - pages/files/browse/index.vue
     */
    share() {
      this.$emit('share', this.file)
    },
  },
})
</script>
<style scoped lang="less" src="./View.less"></style>
