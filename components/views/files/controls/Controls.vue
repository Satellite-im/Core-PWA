<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'

import { FolderPlusIcon, FilePlusIcon } from 'satellite-lucide-icons'
import { FilesViewEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  components: {
    FolderPlusIcon,
    FilePlusIcon,
  },
  // todo - best practice would be emitting rather than passing function as a prop - AP-639
  props: {
    changeView: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      text: '' as string,
      input: { show: false as boolean, type: '' as FilesViewEnum },
    }
  },
  computed: {
    FilesViewEnum: () => FilesViewEnum,
  },
  methods: {
    toggleInput(type: FilesViewEnum) {
      if (!this.input.show) {
        this.input.show = true
        this.input.type = type
        return
      }
      if (type !== this.input.type) {
        this.input.type = type
        return
      }
      this.input.show = !this.input.show
    },
    addItem() {
      if (!this.text) {
        return
      }
      if (this.input.type === FilesViewEnum.FOLDER) {
        // add folder
        this.$store.commit('bucket/createDirectory', this.text)
        this.input.show = false
        this.text = ''
        this.$emit('forceRender')
        return
      }
      // add file todo - gather description
      this.$store.commit('bucket/createFile', this.text)
      this.input.show = false
      this.text = ''
      this.$emit('forceRender')
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
