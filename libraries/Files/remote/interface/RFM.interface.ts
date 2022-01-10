import { Item } from "../../abstracts/Item.abstract";
import { Directory } from "../../Directory";
import { Fil } from "../../Fil";

export interface RFMInterface {
  updateIndex(index: Array<Item | Directory>): void
  getIndex(): Array<Item | Directory>
  upload(file: File, name: string, meta: any): string
  delete(file: Fil): boolean
}