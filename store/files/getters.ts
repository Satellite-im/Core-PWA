import { GetterTree } from 'vuex'
import { FileRouteEnum, FileSortEnum } from '~/libraries/Enums/enums'
import { IridiumDirectory, IridiumItem } from '~/libraries/Iridium/files/types'
import { FilesState } from '~/store/files/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export interface FilesGetters {
  sortedItems(
    state: FilesState,
  ): (items: IridiumItem[], route: FileRouteEnum) => IridiumItem[]
}

const getters: GetterTree<FilesState, RootState> & FilesGetters = {
  filterSearch:
    (state: FilesState) =>
    (items: IridiumItem[], searchFilter: string): IridiumItem[] => {
      if (!searchFilter) {
        return items
      }

      const parentId = state.path.at(-1)?.id
      items =
        (iridium.files.flat.find((e) => e.id === parentId) as IridiumDirectory)
          ?.children ?? items

      const searchLower = searchFilter.toLowerCase()
      return items.filter((item) => {
        return item.name.toLowerCase().includes(searchLower)
      })
    },

  sortedItems:
    (state: FilesState) =>
    (files: IridiumItem[], route: FileRouteEnum): IridiumItem[] => {
      const key = state.sort.category

      const flatFiles = flatDeep(files)
      let items: IridiumItem[] = files

      if (state.path.length) {
        const parentId = state.path.at(-1)?.id
        items =
          (flatFiles.find((e) => e.id === parentId) as IridiumDirectory)
            ?.children ?? files
        // if recent, get 15 most recently edited FILES. no directories
      } else if (route === FileRouteEnum.RECENT) {
        items =
          flatFiles
            .filter((e) => !('children' in e))
            .sort((a, b) => b.modified - a.modified)
            .slice(0, 14) ?? files
      }
      if (key === FileSortEnum.SIZE) {
        return items.sort(
          state.sort.asc
            ? (a, b) => a[key] - b[key]
            : (a, b) => b[key] - a[key],
        )
      }
      if (key === FileSortEnum.MODIFIED) {
        return items.sort(
          state.sort.asc
            ? (a, b) => b[key] - a[key]
            : (a, b) => a[key] - b[key],
        )
      }
      return items.sort(
        state.sort.asc
          ? (a, b) =>
              a[key].localeCompare(b[key], undefined, { sensitivity: 'base' })
          : (a, b) =>
              b[key].localeCompare(a[key], undefined, { sensitivity: 'base' }),
      )
    },
}

const flatDeep = (list: IridiumItem[]): IridiumItem[] => {
  return list.reduce((prev: IridiumItem[], curr) => {
    prev.push(curr)
    if ('children' in curr) {
      prev.push(...flatDeep(curr.children))
    }
    return prev
  }, [])
}

export default getters
