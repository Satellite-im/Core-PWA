import { GetterTree } from 'vuex'
import { FileSortEnum } from '~/libraries/Enums/enums'
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
            iridium.files?.flat.find(
              (e) => e.id === parentId,
            ) as IridiumDirectory
          )?.children ?? items
      }

      if (key === FileSortEnum.SIZE) {
        return items.sort(
          state.sort.asc
            ? (a: IridiumItem, b: IridiumItem) => a[key] - b[key]
            : (a: IridiumItem, b: IridiumItem) => b[key] - a[key],
        )
      }
      if (key === FileSortEnum.MODIFIED) {
        return items.sort(
          state.sort.asc
            ? (a: IridiumItem, b: IridiumItem) => b[key] - a[key]
            : (a: IridiumItem, b: IridiumItem) => a[key] - b[key],
        )
      }

      return items.sort(
        state.sort.asc
          ? (a: IridiumItem, b: IridiumItem) => a[key].localeCompare(b[key])
          : (a: IridiumItem, b: IridiumItem) => b[key].localeCompare(a[key]),
      )
    },
}

export default getters
