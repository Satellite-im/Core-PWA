<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Directory } from '~/libraries/Files/Directory'

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
      directory: this.$Bucket.fileSystem.currentDirectory.content,
    }
  },
  watch: {},
  mounted(): void {
    const mockFileData = {
      _name: 'TestFile.png',
      _descrption: 'Test file description',
      hash: 'bafkreichz6yyvllpr6akxiqahvvmipf4qbumfa5srfgvventyxdbwrbaga',
    }

    const file = new Fil(...Object.values(mockFileData))

    this.$Bucket.fileSystem.addChild(file)
    this.$Bucket.fileSystem.createDirectory('dir')
    console.log(this.$Bucket)
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
    handle(item: Fil | Directory) {
      if (Object.values(FILE_TYPE).includes(item.type as FILE_TYPE)) {
        this.file = item
      }
      if (Object.values(DIRECTORY_TYPE).includes(item.type as DIRECTORY_TYPE)) {
        this.$Bucket.fileSystem.openDirectory(item.name)
        console.log('folder')
        console.log(this.$Bucket)
        this.directory = this.$Bucket.fileSystem.currentDirectory.content
      }
    },
    // getPath(): any {
    //   if (this.$data.path.length === 0) {
    //     return this.files.tree
    //   }
    //   let files = this.files.tree
    //   for (let i = 0; i < this.$data.path.length; i++) {
    //     files = files.children.filter(
    //       (item: any) => item.name === this.$data.path[i],
    //     )[0]
    //   }
    //   return files
    // },
    // push(item: any) {
    //   if (item.children) {
    //     this.$data.path.push(item.name)
    //   }
    // },
    // pull(count: number = 1) {
    //   for (let i = 0; i < count; i++) {
    //     this.$data.path.pop()
    //   }
    // },
    // setPath(pth: Array<String>) {
    //   this.$data.path = pth
    // },
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
    // cancelUpload() {
    //   this.$data.file = false
    //   this.$data.url = ''
    // },
  },
})
</script>

<style scoped lang="less" src="./Browse.less"></style>
