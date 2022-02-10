<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Directory } from '~/libraries/Files/Directory'
import { Fil } from '~/libraries/Files/Fil'

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
      key: 1 as number, // needed to force render on addChild. Vue2 lacks reactivity for Map
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
      if (item instanceof Fil) {
        this.file = item
      }
      if (item instanceof Directory) {
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
