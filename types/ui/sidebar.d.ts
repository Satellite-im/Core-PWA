import { TranslateResult } from 'vue-i18n'
import { FileAsideRouteEnum } from '~/libraries/Enums/enums'

export type SidebarLink = {
  to: String
  text: String
}

export type SidebarGrouping = {
  title: String
  links: Array<SidebarLink>
}

export interface SimpleItem {
  text: string | TranslateResult
  route: FileAsideRouteEnum
  icon: string
}
