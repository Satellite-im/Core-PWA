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
  computed: {
    ...mapState(['ui']),
    isImage(): boolean {
      return Boolean(this.file.name.match(this.$Config.regex.image))
    },
  },
  methods: {
    /**
     * @method share
     * @description copy link to clipboard and toggle shared status
     */
    async share() {
      if (!this.file.shared) {
        this.$store.commit('ui/setIsLoadingFileIndex', true)
        this.file.shareItem()
        await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
        this.$store.commit('ui/setIsLoadingFileIndex', false)
      }
      navigator.clipboard.writeText(this.path).then(() => {
        this.$toast.show(this.$t('pages.files.link_copied') as string)
      })
      this.$emit('forceRender')
    },
  },
})
</script>
<style scoped lang="less" src="./View.less"></style>
