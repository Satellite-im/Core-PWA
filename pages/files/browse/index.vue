<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Fil } from '~/libraries/Files/Fil'
import { DIRECTORY_TYPE } from '~/libraries/Files/types/directory'
import { FILE_TYPE } from '~/libraries/Files/types/file'

declare module 'vue/types/vue' {
  interface Vue {
    file: Fil | boolean
    key: number
  }
}

export default Vue.extend({
  name: 'Files',
  layout: 'files',
  data() {
    return {
      file: false as Fil | boolean,
      view: 'grid',
      key: 1 as number,
    }
  },
  computed: {
    ...mapState(['bucket']),
    directory() {
      return (
        this.key && (this.bucket.fileSystem?.currentDirectory?.content ?? [])
      )
    },
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
        this.file = item as Fil
      }
      if (Object.values(DIRECTORY_TYPE).includes(item.type as DIRECTORY_TYPE)) {
        this.$store.commit('bucket/openDirectory', item.name)
      }
    },
    forceRender() {
      this.key++
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
