import { Fil } from "../../Fil";

export interface RFMInterface {
  upload(file: File, name: string, meta: any): string
  delete(file: Fil): boolean
}