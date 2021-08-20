export type SidebarLink = {
  to: String
  text: String
}

export type SidebarGrouping = {
  title: String
  links: Array<SidebarLink>
}

export type SimpleItem = {
  icon: String
  text: String
  active: Boolean
}

export type SimpleList = Array<SimpleItem>
