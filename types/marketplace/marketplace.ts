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
