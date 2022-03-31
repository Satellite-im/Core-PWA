<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Directory } from '~/libraries/Files/Directory'
import { Fil } from '~/libraries/Files/Fil'
import { FilSystem } from '~/libraries/Files/FilSystem'

export default Vue.extend({
  name: 'Files',
  layout: 'files',
  data() {
    return {
      file: false as Fil | boolean,
      view: 'grid',
      counter: 1 as number, // needed to force render on addChild. Vue2 lacks reactivity for Map
      fileSystem: this.$FileSystem as FilSystem,
    }
  },
  computed: {
    /**
     * @returns Current directory items
     * @description included counter to force rendering on Map updates
     */
    directory() {
      return (
        this.$data.counter &&
        (this.$data.fileSystem?.currentDirectory?.content ?? [])
      )
    },
  },
  mounted() {
    console.log(this.fileSystem)
  },
  methods: {
    /**
     * @method changeView DocsTODO
     * @description
     * @param type
     * @example
     */
    changeView(type: 'grid' | 'list') {
      this.view = type
    },
    /**
     * @method handle
     * @description emitted from child components. Either open file view or directory
     * @param {Item} item
     */
    handle(item: Item) {
      if (item instanceof Fil) {
        this.file = item
      }
      if (item instanceof Directory) {
        this.fileSystem.openDirectory(item.name)
      }
    },
    /**
     * @method like
     * @description toggle like boolean, update bucket index
     * @param {Item} item
     */
    async like(item: Item) {
      this.$store.commit('ui/setIsLoadingFileIndex', true)
      item.toggleLiked()
      await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      item.liked
        ? this.$toast.show(this.$t('pages.files.add_favorite') as string)
        : this.$toast.show(this.$t('pages.files.remove_favorite') as string)
      this.$store.commit('ui/setIsLoadingFileIndex', false)
      this.forceRender()
    },
    /**
     * @method share
     * @description copy link to clipboard
     * @param {Item} item
     */
    async share(item: Item) {
      this.$toast.show(this.$t('todo - share') as string)
      // if (item instanceof Directory) {
      //   this.$toast.show(this.$t('todo - share folders') as string)
      //   return
      // }
      // if (!item.shared) {
      //   this.$store.commit('ui/setIsLoadingFileIndex', true)
      //   item.shareItem()
      //   await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      //   this.$store.commit('ui/setIsLoadingFileIndex', false)
      //   this.$emit('forceRender')
      // }
      // navigator.clipboard.writeText(this.path).then(() => {
      //   this.$toast.show(this.$t('pages.files.link_copied') as string)
      // })
    },
    /**
     * @method remove
     * @description delete item from filesystem. If file, also remove from textile bucket
     * @param {Item} item
     */
    async remove(item: Item) {
      this.$store.commit('ui/setIsLoadingFileIndex', true)
      if (item instanceof Fil) {
        await this.$FileSystem.removeFile(item.id)
      }
      this.$FileSystem.removeChild(item.name)
      await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      this.$store.commit('ui/setIsLoadingFileIndex', false)
      this.forceRender()
    },
    /**
     * @method forceRender
     * @description Force render of new directory items after filesystem update
     */
    forceRender() {
      this.counter++
    },
  },
})
</script>

<style scoped lang="less" src="./Browse.less"></style>
