import { Fil } from '../../Fil'
import { FileSystemExport } from '~/libraries/Files/types/filesystem'

export interface RFMInterface {
  updateIndex(index: FileSystemExport): void
  get index(): FileSystemExport | null
  upload(file: File, name: string, meta: any): string
  delete(file: Fil): boolean
}
