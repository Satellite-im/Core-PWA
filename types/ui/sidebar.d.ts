export type SidebarLink = {
  to: String
  text: String
}

export type SidebarGrouping = {
  title: String
  links: Array<SidebarLink>
}
