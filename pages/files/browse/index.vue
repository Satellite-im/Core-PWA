<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'
import { DataStateType } from '~/store/dataState/state'
import { isNSFW } from '~/utilities/nsfw'

export default Vue.extend({
  name: 'Files',
  layout: 'files',
  data() {
    return {
      root: 'root',
      path: [],
      file: false as File | Boolean,
      url: '' as String,
      nsfw: { status: false, checking: false } as Object,
    }
  },
  computed: {
    DataStateType: () => DataStateType,
  },
  mounted(): void {
    this.$store.dispatch('fetchFiles')
  },
  methods: {
    /**
     * Allows you to get the current path file object
     */
    getPath(): any {
      if (this.$data.path.length === 0) {
        return this.$store.state.files.tree
      }
      let files = this.$store.state.files.tree
      for (let i = 0; i < this.$data.path.length; i++) {
        files = files.children.filter(
          (item: any) => item.name === this.$data.path[i]
        )[0]
      }
      return files
    },
    /**
     * Push a new child name to the path array
     */
    push(item: any) {
      if (item.children) {
        this.$data.path.push(item.name)
      }
    },
    /**
     * Pull n items from the file path array
     */
    pull(count: number = 1) {
      for (let i = 0; i < count; i++) {
        this.$data.path.pop()
      }
    },
    /**
     * Manually override the path array from a child component
     */
    setPath(pth: Array<String>) {
      this.$data.path = pth
    },
    /**
     * Triggered when a file is changed on the input
     */
    handleFile(event: any) {
      this.$data.file = event.target.files[0]
      this.loadPicture(this.$data.file)
    },
    /**
     * Load a picture into a data URL push to data
     */
    async loadPicture(file: File) {
      if (!file) return
      this.$data.nsfw.checking = true
      this.$data.nsfw.status = await isNSFW(file)
      this.$data.nsfw.checking = false
      const self = this
      const reader = new FileReader()
      reader.onload = function (e: Event | any) {
        if (e.target) self.$data.url = e.target.result
      }
      reader.readAsDataURL(file)
    },
    /**
     * Clear local data
     * TODO: Clear input field, this currently breaks
     * when you upload the same file after cancelling
     */
    cancelUpload() {
      this.$data.file = false
      this.$data.url = ''
    },
  },
})
</script>

<style scoped lang="less" src="./Browse.less"></style>
