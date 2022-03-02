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
import encode from '~/utilities/EncodeSvg'

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
      svgSrc: '' as string,
    }
  },
  computed: {
    ...mapState(['ui']),
    path(): string {
      return this.$Config.textile.browser + this.file.hash
    },
    isImage(): boolean {
      return Boolean(this.file.name.match(this.$Config.regex.image))
    },
    isSvg(): boolean {
      return Boolean(this.file.name.match(this.$Config.regex.svg))
    },
  },
  mounted() {
    if (this.isSvg) {
      this.encodeSvg()
    }
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
    /**
     * @method encodeSvg
     * @description converts svg at path to usable data string
     */
    async encodeSvg() {
      this.svgSrc = await encode(this.path)
    },
  },
})
</script>
<style scoped lang="less" src="./View.less"></style>
