<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Fil } from '~/libraries/Files/Fil'
import { DIRECTORY_TYPE } from '~/libraries/Files/types/directory'
import { FILE_TYPE } from '~/libraries/Files/types/file'

export default Vue.extend({
  name: 'Files',
  layout: 'files',
  data() {
    return {
      file: false as Fil | boolean,
      view: 'grid',
    }
  },
  computed: {
    directory() {
      return this.$Bucket.fileSystem.currentDirectory.content
    },
  },
  beforeMount(): void {
    const mockFileData = {
      _name: 'TestFile.png',
      _descrption: 'Test file description',
      hash: 'bafkreichz6yyvllpr6akxiqahvvmipf4qbumfa5srfgvventyxdbwrbaga',
    }

    const file = new Fil(...Object.values(mockFileData))

    this.$Bucket.fileSystem.addChild(file)
    this.$Bucket.fileSystem.createDirectory('dir')
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
    handle(item: Item) {
      if (Object.values(FILE_TYPE).includes(item.type as FILE_TYPE)) {
        this.file = item
      }
      if (Object.values(DIRECTORY_TYPE).includes(item.type as DIRECTORY_TYPE)) {
        this.$Bucket.fileSystem.openDirectory(item.name)
        console.log(this.$Bucket)
      }
    },
    // todo-handle upload
    // async handleFile(event: any) {
    //   this.$data.file = event.target.files[0]
    //   this.$data.nsfw.checking = true
    //   this.$data.nsfw.status = await this.$Security.isNSFW(this.$data.file)
    //   this.$data.nsfw.checking = false
    //   this.loadPicture(this.$data.file)
    // },
    // loadPicture(file: File) {
    //   if (!file) return
    //   const self = this
    //   const reader = new FileReader()
    //   reader.onload = function (e: Event | any) {
    //     if (e.target) self.$data.url = e.target.result
    //   }
    //   reader.readAsDataURL(file)
    // },
  },
})
</script>

<style scoped lang="less" src="./Browse.less"></style>
