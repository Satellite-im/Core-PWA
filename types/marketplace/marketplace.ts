import { Glyph } from '../ui/glyph'

export type CategoryOption = {
  parentCategory: string
  name: string
  icon: string
}

export type CategoryTreeItem = {
  index: number
  parent: CategoryTreeItem | null
  self: CategoryOption
  depth: number
  collapsed: boolean
  selected: boolean
  hidden: boolean
  children: CategoryTreeItem[]
}

export type FilterOption = {
  field: string
  ascending: boolean
  text: string
}

export type ProductItem = {
  name: string
  description: string
  price: number
  new: boolean
  image: string
  favorited: boolean
}

export type GlyphShopFilterItem = {
  name: string
  id: string
}

export type GlyphShopItem = {
  id: number
  glyph: Glyph
  price: number
  image: string | typeof import('*.webp')
  isNew: boolean
  isSale: boolean
  like: boolean
}
