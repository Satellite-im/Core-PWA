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
  watch: {
    'input.type'(newVal) {
      this.$nextTick(() => {
        if (!newVal) {
          return
        }
        // @ts-ignore
        this.$refs.nameInputGroup?.$refs.input.focus()
      })
    },
  },
  methods: {
    toggleInput(type: FilesViewEnum) {
      if (!this.input.show) {
        this.input = { show: true, type }
        return
      }
      if (type !== this.input.type) {
        this.input.type = type
        this.text = ''
        return
      }
      this.input = { show: false, type: FilesViewEnum.EMPTY }
      this.text = ''
    },
    addItem() {
      if (!this.text) {
        return
      }
      // add folder to filesystem
      if (this.input.type === FilesViewEnum.FOLDER) {
        try {
          this.$store.commit('bucket/createDirectory', this.text)
        } catch (e) {
          console.log(e)
        }
        this.input = { show: false, type: FilesViewEnum.EMPTY }
        this.text = ''
        this.$emit('forceRender')
        return
      }
      // add file todo - gather description
      this.$store.commit('bucket/createFile', this.text)
      this.input = { show: false, type: FilesViewEnum.EMPTY }
      this.text = ''
      this.$emit('forceRender')
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
