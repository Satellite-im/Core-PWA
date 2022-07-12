<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { FileRouteEnum } from '~/libraries/Enums/enums'
import iridium from '~/libraries/Iridium/IridiumManager'
import { IridiumItem } from '~/libraries/Iridium/files/types'
import { RootState } from '~/types/store/store'
import { ModalWindows } from '~/store/ui/types'

export default Vue.extend({
  name: 'Files',
  layout: 'files',
  data() {
    return {
      items: iridium.files?.state.items ?? [],
    }
  },
  computed: {
    ...mapState({
      sort: (state) => (state as RootState).files.sort,
      path: (state) => (state as RootState).files.path,
      gridLayout: (state) => (state as RootState).files.gridLayout,
      modals: (state) => (state as RootState).ui.modals,
    }),
    ...mapGetters({
      sortedItems: 'files/sortedItems',
    }),
    directory(): IridiumItem[] {
      return this.sortedItems(this.items)
    },
  },
  methods: {
    /**
     * @description if directory, set new path. if file, open fullscreen view
     * @param {IridiumItem} item
     */
    handle(item: IridiumItem) {
      // if directory
      if ('children' in item) {
        this.$store.commit('files/setPath', [
          ...this.path,
          { id: item.id, name: item.name },
        ])
        return
      }
      this.$store.commit('files/setPreview', item)
    },
    /**
     * @description toggle like boolean, update bucket index
     * @param {IridiumItem} item
     */
    like(item: IridiumItem) {
      iridium.files?.updateItem({
        id: item.id,
        liked: !item.liked,
        parentId: item.parentId,
      })
      item.liked
        ? this.$toast.show(this.$t('pages.files.add_favorite') as string)
        : this.$toast.show(this.$t('pages.files.remove_favorite') as string)
    },
    /**
     * @description delete item from iridium store
     * @param {IridiumItem} item
     */
    remove(item: IridiumItem) {
      iridium.files?.removeItem(item)
    },
    /**
     * @description set rename item and display modal
     * @param {IridiumItem} item
     */
    rename(item: IridiumItem) {
      this.$store.commit('files/setRename', item)
      this.$store.commit('ui/toggleModal', {
        name: ModalWindows.RENAME_FILE,
        state: !this.modals[ModalWindows.RENAME_FILE],
      })
    },
    /**
     * @param {IridiumItem} item
     */
    share(item: IridiumItem) {
      this.$toast.show(this.$t('todo - share') as string)
    },
  },
})
</script>

<style scoped lang="less" src="./Browse.less"></style>
