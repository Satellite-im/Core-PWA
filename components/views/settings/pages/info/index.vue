<template src="./Developer.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ReleaseNotes } from '~/libraries/ui/ReleaseNotes'
import VueMarkdown from 'vue-markdown'

export default Vue.extend({
  name: 'DeveloperSettings',
  components: {
    VueMarkdown,
  },
  layout: 'settings',
  data() {
    return {
      cpu: undefined,
      window: window,
      renderer: undefined,
      debugInfo: undefined,
      releaseData: '',
    }
  },
  computed: {
    ...mapState(['accounts']),
  },
  mounted() {
    this.getReleaseBody()
    // if (this.window.navigator.product === 'Gecko') {
    //   const canvas = document.createElement('canvas')
    //   let gl, debugInfo, vendor, renderer
    //   try {
    //     gl =
    //       canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    //   } catch (e) {
    //     console.warn('cannot create webgl canvas')
    //   }

    //   if (gl) {
    //     this.debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    //     this.cpu = gl.getParameter(this.debugInfo.UNMASKED_VENDOR_WEBGL)
    //     this.renderer = gl.getParameter(this.debugInfo.UNMASKED_RENDERER_WEBGL)
    //   }
    // }

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
