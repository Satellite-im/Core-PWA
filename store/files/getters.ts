import { GetterTree } from 'vuex'
import { FileRouteEnum, FileSortEnum } from '~/libraries/Enums/enums'
import { IridiumDirectory, IridiumItem } from '~/libraries/Iridium/files/types'
import { FilesState } from '~/store/files/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export interface FilesGetters {
  sortedItems(state: FilesState): (items: IridiumItem[]) => IridiumItem[]
}

const getters: GetterTree<FilesState, RootState> & FilesGetters = {
  sortedItems:
    (state: FilesState) =>
    (items: IridiumItem[]): IridiumItem[] => {
      const key = state.sort.category

      if (state.path.length) {
        const parentId = state.path.at(-1)?.id
        items =
          (
            iridium.files.flat.find(
              (e) => e.id === parentId,
            ) as IridiumDirectory
          )?.children ?? items
        // if recent, get 15 most recently edited FILES. no directories
      } else if (state.route === FileRouteEnum.RECENT) {
        items =
          iridium.files.flat
            .filter((e) => !('children' in e))
            .sort((a, b) => b.modified - a.modified)
            .slice(0, 14) ?? items
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

export default getters
