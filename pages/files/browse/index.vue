<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Directory } from '~/libraries/Files/Directory'
import { Fil } from '~/libraries/Files/Fil'
import { FilSystem } from '~/libraries/Files/FilSystem'

declare module 'vue/types/vue' {
  interface Vue {
    file: Fil | boolean
    counter: number
    fileSystem: FilSystem
  }
}

export default Vue.extend({
  name: 'Files',
  layout: 'files',
  data() {
    return {
      file: false as Fil | boolean,
      view: 'grid',
      counter: 1 as number, // needed to force render on addChild. Vue2 lacks reactivity for Map
      fileSystem: this.$FileSystem,
    }
  },
  computed: {
    directory() {
      return this.counter && (this.fileSystem?.currentDirectory?.content ?? [])
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
        this.fileSystem.openDirectory(item.name)
      }
    },
    forceRender() {
      this.counter++
    },
  },
})
</script>

<style scoped lang="less" src="./Browse.less"></style>
