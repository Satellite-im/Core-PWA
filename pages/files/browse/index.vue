<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { Directory } from '~/libraries/Files/Directory'
import { Fil } from '~/libraries/Files/Fil'
import { FilSystem } from '~/libraries/Files/FilSystem'
import { FileAsideRouteEnum, FileSortEnum } from '~/libraries/Enums/enums'
import { FileSort } from '~/store/ui/types'

export default Vue.extend({
  name: 'Files',
  layout: 'files',
  data() {
    return {
      view: 'grid',
      counter: 1 as number, // needed to force render on addChild. Vue2 lacks reactivity for Map
      fileSystem: this.$FileSystem as FilSystem,
    }
  },
  computed: {
    sort: {
      set(value: FileSort) {
        this.$store.commit('ui/setFileSort', value)
      },
      get(): FileSort {
        return this.$store.state.ui.fileSort
      },
      /**
       * @returns Current directory items
       * @description included counter to force rendering on Map updates
       */
    },
    directory(): Item[] {
      if (this.$route.query.route === FileAsideRouteEnum.RECENT) {
        return (
          this.$data.counter &&
          this.fileSystem.sortContent(this.sort, this.fileSystem.recentFiles)
        )
      }
      return (
        this.$data.counter &&
        this.fileSystem.sortContent(this.sort, this.fileSystem.content)
      )
    },
  },
  watch: {
    '$route.query.route': {
      handler(value) {
        this.fileSystem.goBackToDirectory('root')
        // if invalid route, reset to default
        if (!Object.values(FileAsideRouteEnum).includes(value)) {
          this.$router.push({ query: {} })
        }
      },
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
      this.view = type
    },
    /**
     * @method handle
     * @description emitted from child components. Either open file view or directory
     * @param {Item} item
     */
    handle(item: Item) {
      if (item instanceof Fil) {
        this.$store.commit('ui/setFilePreview', item)
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
      item.toggleLiked()
      this.$store.commit(
        'ui/setFilesUploadStatus',
        this.$t('pages.files.status.index'),
      )
      await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      item.liked
        ? this.$toast.show(this.$t('pages.files.add_favorite') as string)
        : this.$toast.show(this.$t('pages.files.remove_favorite') as string)
      this.$store.commit('ui/setFilesUploadStatus', '')
      this.forceRender()
    },
    /**
     * @method remove
     * @description delete item from filesystem. If file, also remove from textile bucket
     * @param {Item} item
     */
    async remove(item: Item) {
      if (item instanceof Fil) {
        this.$store.commit(
          'ui/setFilesUploadStatus',
          this.$t('pages.files.status.delete', [item.name]),
        )
        await this.$FileSystem.removeFile(item.id)
      }
      this.$FileSystem.removeChild(item.name, item.parent)
      this.$store.commit(
        'ui/setFilesUploadStatus',
        this.$t('pages.files.status.index'),
      )
      await this.$TextileManager.bucket?.updateIndex(this.$FileSystem.export)
      this.$store.commit('ui/setFilesUploadStatus', '')

      this.forceRender()
    },
    /**
     * @method share
     * @description copy link to clipboard
     * @param {Item} item
     */
    async share(item: Item) {
      this.$toast.show(this.$t('todo - share') as string)
    },
    /**
     * @method setSort
     * @description if current category, swap asc/desc. if different, change category
     */
    setSort(category: FileSortEnum) {
      this.sort =
        this.sort.category === category
          ? { category: this.sort.category, asc: !this.sort.asc }
          : { category, asc: true }
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
