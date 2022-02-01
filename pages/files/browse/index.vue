<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'

import { mapState } from 'vuex'
import { DataStateType } from '~/store/dataState/types'

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
      view: 'grid',
    }
  },
  computed: {
    ...mapState(['files', 'dataState']),
    DataStateType: () => DataStateType,
  },
  mounted(): void {
    this.$store.dispatch('files/fetchFiles')
  },
  methods: {
    /**
     * @method changeView DocsTODO
     * @description
     * @param type
     * @example
     */
    changeView(type: 'grid' | 'list') {
      this.$data.view = type
    },
    /**
     * Allows you to get the current path file object
     */
    /**
     * @method getPath DocsTODO
     * @description
     * @returns
     * @example
     */
    getPath(): any {
      if (this.$data.path.length === 0) {
        return this.files.tree
      }
      let files = this.files.tree
      for (let i = 0; i < this.$data.path.length; i++) {
        files = files.children.filter(
          (item: any) => item.name === this.$data.path[i],
        )[0]
      }
      return files
    },
    /**
     * Push a new child name to the path array
     */
    /**
     * @method push DocsTODO
     * @description
     * @param item
     * @example
     */
    push(item: any) {
      if (item.children) {
        this.$data.path.push(item.name)
      }
    },
    /**
     * Pull n items from the file path array
     */
    /**
     * @method pull DocsTODO
     * @description
     * @param count
     * @example
     */
    pull(count: number = 1) {
      for (let i = 0; i < count; i++) {
        this.$data.path.pop()
      }
    },
    /**
     * Manually override the path array from a child component
     */
    /**
     * @method setPath DocsTODO
     * @description
     * @param pth
     * @example
     */
    setPath(pth: Array<String>) {
      this.$data.path = pth
    },
    /**
     * Triggered when a file is changed on the input
     */
    /**
     * @method handleFile DocsTODO
     * @description
     * @param event
     * @example
     */
    async handleFile(event: any) {
      this.$data.file = event.target.files[0]
      this.$data.nsfw.checking = true
      this.$data.nsfw.status = await this.$Security.isNSFW(this.$data.file)
      this.$data.nsfw.checking = false
      this.loadPicture(this.$data.file)
    },
    /**
     * Load a picture into a data URL push to data
     */
    /**
     * @method loadPicture DocsTODO
     * @description
     * @param file
     * @example
     */
    loadPicture(file: File) {
      if (!file) return
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
    /**
     * @method cancelUpload DocsTODO
     * @description
     * @example
     */
    cancelUpload() {
      this.$data.file = false
      this.$data.url = ''
    },
  },
})
</script>

<style scoped lang="less" src="./Browse.less"></style>
