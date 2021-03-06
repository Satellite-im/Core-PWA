<template src="./Files.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import { IridiumItem } from '~/libraries/Iridium/files/types'
import { RootState } from '~/types/store/store'
import { ModalWindows } from '~/store/ui/types'
import { FileRouteEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  name: 'Files',
  layout: 'basic',
  data() {
    return {
      items: iridium.files.state.items,
    }
  },
  computed: {
    ...mapState({
      sort: (state) => (state as RootState).files.sort,
      path: (state) => (state as RootState).files.path,
      gridLayout: (state) => (state as RootState).files.gridLayout,
      modals: (state) => (state as RootState).ui.modals,
      showSidebar: (state) => (state as RootState).ui.showSidebar,
    }),
    ...mapGetters({
      sortedItems: 'files/sortedItems',
    }),
    directory(): IridiumItem[] {
      return this.sortedItems(this.items, this.$route.query.route)
    },
  },
  watch: {
    '$route.query.route': {
      handler(value) {
        this.$store.commit('files/setPath', [])
        // if invalid route, reset to default
        if (!Object.values(FileRouteEnum).includes(value)) {
          this.$router.push({ query: {} })
        }
      },
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
      iridium.files.updateItem({
        item,
        liked: !item.liked,
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
      iridium.files.removeItem(item)
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

<style scoped lang="less" src="./Files.less"></style>
