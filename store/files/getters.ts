import Vue from 'vue'
import { GetterTree } from 'vuex'
import fuzzysort from 'fuzzysort'
import { FileRouteEnum, FileSortEnum } from '~/libraries/Enums/enums'
import { IridiumDirectory, IridiumItem } from '~/libraries/Iridium/files/types'
import { FilesState } from '~/store/files/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export interface FilesGetters {
  sortedItems(
    state: FilesState,
  ): (filteredFiles: IridiumItem[], route: FileRouteEnum) => IridiumItem[]
}

const getters: GetterTree<FilesState, RootState> & FilesGetters = {
  searchedItems:
    (state: FilesState) =>
    (items: IridiumItem[], searchFilter: string): IridiumItem[] => {
      if (!searchFilter) {
        return items
      }

      if (state.search.searchAll) {
        items = iridium.files.flat
      } else {
        const parentId = state.path.at(-1)?.id
        const parent = iridium.files.flat.find(
          (e) => e.id === parentId,
        ) as IridiumDirectory

        if (parent?.children) {
          items = parent.children
        }
      }

      const results = fuzzysort.go(searchFilter, items, {
        keys: ['name'],
      })
      Vue.delete(results, 'total')

      return results.map((e: { obj: {} }) => e.obj as IridiumItem)
    },

  sortedItems:
    (state: FilesState) =>
    (items: IridiumItem[], route: FileRouteEnum): IridiumItem[] => {
      const key = state.sort.category
      const searchAllActive = state.search.searchAll && state.search.value

      // If "SearchAll" is inactive, we only want to sort the items that are in the current directory
      if (!searchAllActive && state.path.length) {
        const parentId = state.path.at(-1)?.id
        const parent = iridium.files.flat.find(
          (e) => e.id === parentId,
        ) as IridiumDirectory

        if (parent?.children) {
          items = parent.children
        }
        // If set to "Recent", get 15 most recently edited files (no directories)
      } else if (route === FileRouteEnum.RECENT) {
        const recentItems = iridium.files.flat
          .filter((e) => !('children' in e))
          .sort((a, b) => b.modified - a.modified)
          .slice(1, 14)

        if (recentItems) {
          items = recentItems
        }
      }

      // Sort the items by the selected key
      switch (key) {
        case FileSortEnum.SIZE:
          items.sort((a, b) => a.size - b.size)
          break
        case FileSortEnum.MODIFIED:
          items.sort((a, b) => b.modified - a.modified)
          break
        default:
          // Sort alphabetically
          items.sort((a, b) =>
            a[key].localeCompare(b[key], undefined, {
              sensitivity: 'base',
            }),
          )
      }

      // Reverse the sort if the selected key is descending
      if (!state.sort.asc) {
        items = items.reverse()
      }

      return items
    },
}

export default getters
