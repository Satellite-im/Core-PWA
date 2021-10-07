<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'

import { FolderPlusIcon } from 'satellite-lucide-icons'
import FileUpload from '~/components/tailored/core/fileupload/FileUpload.vue'

export default Vue.extend({
  components: {
    FileUpload,
    FolderPlusIcon,
  },
  props: {
    handleFile: {
      type: Function,
      default: () => () => {},
    },
    changeView: {
      type: Function,
      default: () => () => {},
    },
  },
  data() {
    return {
      text: '',
    }
  },
  methods: {
    show(modalName: String) {
      this.$store.commit('toggleModal', { name: modalName, state: true })
    },
    hide(modalName: String) {
      this.$store.commit('toggleModal', { name: modalName, state: false })
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
