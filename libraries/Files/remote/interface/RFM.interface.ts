import { Item } from "../../abstracts/Item.abstract"
import { Fil } from "../../Fil"

export interface RFMInterface {
  updateIndex(index: FileSystem): void
  getIndex(): Array<Item> | Promise<Array<Item>>
  upload(file: File, name: string, meta: any): string
  delete(file: Fil): boolean
}