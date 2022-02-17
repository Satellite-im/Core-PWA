import { Directory } from '../Directory'

export interface ItemInterface {
  path: string
  name: string
  id: string
  parent: Directory | null
  liked: boolean
  shared: boolean
}
