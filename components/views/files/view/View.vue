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
import { filetypeextension } from 'magic-bytes.js'
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
      name: this.file.name as string,
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
      const fsFil: Fil = this.$FileSystem.getChild(this.file.name) as Fil
      fsFil.file = await this.$TextileManager.bucket?.pullFile(
        this.file.id,
        this.file.name,
        this.file.type,
      )
      this.load = false
    }
    const fileExt = this.file.name
      .slice(((this.file.name.lastIndexOf('.') - 1) >>> 0) + 2)
      .toLowerCase()
    // you only need the first 100 bytes or so to confirm file type
    const dataExt = filetypeextension(
      new Uint8Array(await this.file.file.slice(0, 100).arrayBuffer()),
    )[0]
    if (fileExt !== dataExt) {
      this.name += `.${dataExt}`
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
