<template src="./Info.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import VueMarkdown from 'vue-markdown'
import { ReleaseNotes } from '~/libraries/ui/ReleaseNotes'

export default Vue.extend({
  name: 'DeveloperSettings',
  components: {
    VueMarkdown,
  },
  layout: 'settings',
  data() {
    return {
      cpu: undefined,
      window,
      renderer: undefined,
      debugInfo: undefined,
      releaseData: '',
    }
  },
  computed: {
    ...mapState(['accounts']),
  },
  async mounted() {
    await this.getReleaseBody()
    this.debugInfo = this.$envinfo.debugInfo
    this.cpu = this.$envinfo.cpu
    this.renderer = this.$envinfo.renderer
  },
  methods: {
    async getReleaseBody() {
      await ReleaseNotes().then((releaseData) => {
        this.releaseData = releaseData
      })
    },
  },
})
</script>
<style scoped lang="less">
pre {
  white-space: pre-wrap;
  text-align: left;
  &:extend(.bordered);
  &:extend(.round-corners);
  font-size: @font-size-xs;
  padding: 12px 16px;
  background: @semitransparent-dark-gradient;
}

.release-data {
  font-family: @heading-font;
  font-size: @font-size-xs;
  white-space: pre-line;
}
</style>
