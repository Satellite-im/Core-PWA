import { Item } from '../../abstracts/Item.abstract'
import { Fil } from '../../Fil'
import { FileSystemExport } from '~/libraries/Files/types/filesystem'

export interface RFMInterface {
  updateIndex(index: FileSystemExport): void
  getIndex(): Array<Item> | Promise<Array<Item>>
  upload(file: File, name: string, meta: any): string
  delete(file: Fil): boolean
}
